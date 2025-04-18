import { Injectable, Logger } from '@nestjs/common';
import { ShikimoriService } from '../shikimori-api/shikimori.service';
import { ProgressService } from '../../progress/progress.service';
import {
  ParsingSession,
  ParsingSessionStatus,
  ParsingSessionType,
} from '@prisma/__generated__';
import { AnimeFromShikimori } from '../shikimori-api/dto/anime.dto';
import { UpdateDbService } from 'apps/update-anime-microservice/src/update-db/update-db.service';
import SearchAnimeParamsDto from '../shikimori-api/dto/search-anime-params.dto';

@Injectable()
export class ParseShikimoriService {
  private readonly logger = new Logger(ParseShikimoriService.name);
  private readonly BATCH_LIMIT = 50;
  private readonly BATCH_TIME = 60 * 1000;
  private readonly PARSER_NAME = 'SHIKIMORI';

  constructor(
    private readonly shikimoriService: ShikimoriService,
    private readonly progressService: ProgressService,
    private readonly updateDbService: UpdateDbService,
  ) {}

  async startInitParsing() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
    };

    await this.startParsing(ParsingSessionType.CREATE_DATABASE, searchParams);
  }
  async startUpdateOngoings() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
      status: 'ongoing',
    };

    await this.startParsing(ParsingSessionType.UPDATE_ONGOINGS, searchParams);
  }

  async startUpdateThisYear() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
      season: `${new Date().getFullYear()}`,
    };

    await this.startParsing(ParsingSessionType.UPDATE_THIS_YEAR, searchParams);
  }

  async resumeInitParsing() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
    };

    await this.resumeParsing(ParsingSessionType.CREATE_DATABASE, searchParams);
  }

  async resumeUpdateOngoings() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
      status: 'ongoing',
    };

    await this.resumeParsing(ParsingSessionType.UPDATE_ONGOINGS, searchParams);
  }

  async resumeUpdateThisYear() {
    const searchParams = {
      limit: this.BATCH_LIMIT,
      season: `${new Date().getFullYear()}`,
    };

    await this.resumeParsing(ParsingSessionType.UPDATE_THIS_YEAR, searchParams);
  }

  private async startParsing(
    type: ParsingSessionType,
    searchParams: SearchAnimeParamsDto,
  ) {
    const session = await this.progressService.initializeSession(
      this.PARSER_NAME,
      type,
    );

    await this.progressService.updateStatus(
      session.id,
      ParsingSessionStatus.RUNNING,
    );

    this.logger.log(`Начало парсинга ${this.PARSER_NAME} по типу ${type}`);
    await this.processParsing(session, searchParams, type);
  }

  private async resumeParsing(
    type: ParsingSessionType,
    searchParams: SearchAnimeParamsDto,
  ) {
    const session = await this.progressService.getLatestSession(type);

    if (
      !session ||
      session.status === ParsingSessionStatus.COMPLETED ||
      session.status === ParsingSessionStatus.FAILED
    ) {
      this.logger.warn('Нет активной сессии для возобновления парсинга');
      return;
    }

    await this.progressService.updateStatus(
      session.id,
      ParsingSessionStatus.RUNNING,
    );
    this.logger.log(`Продолжение парсинга ${this.PARSER_NAME} по типу ${type}`);

    await this.processParsing(session, searchParams, type);
  }

  private async processParsing(
    session: ParsingSession,
    searchParams: SearchAnimeParamsDto,
    type: ParsingSessionType,
  ) {
    try {
      let hasMore: boolean = true;

      while (hasMore) {
        const currentPage = await this.progressService.getCurrentPage(
          session.id,
        );

        const nextPage = currentPage + 1;

        const animes_chank = await this.parseBatch(
          session.id,
          nextPage,
          searchParams,
        );

        hasMore =
          animes_chank.length !== null &&
          animes_chank.length >= this.BATCH_LIMIT;
      }

      await this.progressService.completeSession(session.id);

      this.logger.log(
        `Завершение парсинга ${this.PARSER_NAME} по типу ${type}`,
      );
    } catch {
      await this.progressService.updateStatus(
        session.id,
        ParsingSessionStatus.FAILED,
      );
      this.logger.error(`Ошибка парсинга ${this.PARSER_NAME} по типу ${type}`);
    }
  }

  private async parseBatch(
    sessionId: number,
    page: number,
    searchParams: SearchAnimeParamsDto,
  ) {
    let retries = 3;
    let processedItems = 0;
    const animes = [] as AnimeFromShikimori[];

    while (retries > 0) {
      try {
        const animeList = await this.shikimoriService.getAnimeList({
          page,
          ...searchParams,
        });

        if (!animeList || animeList.length === 0) {
          return null;
        }

        animes.push(...animeList);
        processedItems += animes.length;

        await this.progressService.updateProgress(
          sessionId,
          page,
          processedItems,
        );
        this.logger.log(
          `Аниме с пачки (страница ${page}) распаршены, количество: ${animes.length}`,
        );
        await this.updateDbService.upsertAnimes(animes);
        this.logger.log(`Обработана пачка (страница ${page})`);
        return animes;
      } catch (e) {
        retries--;
        this.logger.error(
          `Ошибка пачки (страница ${page}), попыток осталось: ${retries}, ${e instanceof Error ? e.message : e}`,
          e instanceof Error ? e.stack : undefined,
        );

        if (retries === 0) {
          throw new Error(
            `Не удалось обработать пачку (страница ${page}), ${e}`,
          );
        }

        processedItems -= animes.length;
        animes.length = 0;
        await new Promise((resolve) => setTimeout(resolve, this.BATCH_TIME));
      }
    }
  }
}
