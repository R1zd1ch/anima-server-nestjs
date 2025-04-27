import { Injectable, Logger } from '@nestjs/common';
import { ShikimoriService } from '../shikimori-api/shikimori.service';
import { ProgressService } from '../../progress/progress.service';
import {
  ParsingSession,
  ParsingSessionStatus,
  ParsingSessionType,
} from '@prisma/__generated__';
import { AnimeFromShikimori } from '../shikimori-api/dto/anime.dto';
import { UpdateDbService } from '../../../update-db/update-db.service';
import SearchAnimeParamsDto from '../shikimori-api/dto/search-anime-params.dto';
import { KodikCheckService } from '../../../check-cdn/kodik-check.service';
import { AnilibriaCheckService } from '../../../check-cdn/anilibria-check.service';
import { getAnimeAliasSync } from 'apps/update-anime-microservice/src/lib/utils/get-anime-alias';
import { ParsingConfig } from './parsing-config';

@Injectable()
export class ParseShikimoriService {
  private readonly logger = new Logger(ParseShikimoriService.name);
  private readonly BATCH_LIMIT = 50;
  private readonly BATCH_TIME = 60 * 1000;
  private readonly MAX_RETRIES = 3;
  private readonly PARSER_NAME = 'SHIKIMORI';

  constructor(
    private readonly shikimoriService: ShikimoriService,
    private readonly progressService: ProgressService,
    private readonly updateDbService: UpdateDbService,
    private readonly kodikCheckService: KodikCheckService,
    private readonly anilibriaCheckService: AnilibriaCheckService,
  ) {}

  public async handleAction(
    action:
      | 'startInitParsing'
      | 'resumeInitParsing'
      | 'startUpdateOngoings'
      | 'resumeUpdateOngoings'
      | 'startUpdateThisYear'
      | 'resumeUpdateThisYear'
      | 'stopInitParsing'
      | 'stopUpdateOngoings'
      | 'stopUpdateThisYear',
  ) {
    switch (action) {
      case 'startInitParsing':
        return await this.handleParsingStart(
          this.getParsingConfig(
            ParsingSessionType.CREATE_DATABASE,
            'Полный парсинг начался',
          ),
        );
      case 'startUpdateOngoings':
        return await this.handleParsingStart(
          this.getParsingConfig(
            ParsingSessionType.UPDATE_ONGOINGS,
            'Обновление онгоингов началось',
          ),
        );
      case 'startUpdateThisYear':
        return await this.handleParsingStart(
          this.getParsingConfig(
            ParsingSessionType.UPDATE_ONGOINGS,
            'Обновление аниме за этот год началось',
          ),
        );
      case 'resumeInitParsing':
        return await this.handleParsingResume(
          this.getParsingConfig(
            ParsingSessionType.CREATE_DATABASE,
            'Полный парсинг продолжился',
          ),
        );
      case 'resumeUpdateOngoings':
        return await this.handleParsingResume(
          this.getParsingConfig(
            ParsingSessionType.UPDATE_ONGOINGS,
            'Обновление онгоингов продолжилось',
          ),
        );
      case 'resumeUpdateThisYear':
        return await this.handleParsingResume(
          this.getParsingConfig(
            ParsingSessionType.UPDATE_ONGOINGS,
            'Обновление аниме за этот год продолжилось',
          ),
        );
      case 'stopInitParsing':
        return await this.stopParsing(ParsingSessionType.CREATE_DATABASE);
      case 'stopUpdateOngoings':
        return await this.stopParsing(ParsingSessionType.UPDATE_ONGOINGS);
      case 'stopUpdateThisYear':
        return await this.stopParsing(ParsingSessionType.UPDATE_ONGOINGS);
      default:
        return null;
    }
  }

  private async handleParsingStart(config: ParsingConfig) {
    await this.startParsing(config.type, config.searchParams);
    return config.successMessage;
  }

  private async handleParsingResume(config: ParsingConfig) {
    await this.resumeParsing(config.type, config.searchParams);
    return config.successMessage;
  }

  private async startParsing(
    type: ParsingSessionType,
    searchParams: SearchAnimeParamsDto,
  ) {
    const session = await this.progressService.initializeSession(
      this.PARSER_NAME,
      type,
    );

    return this.handleParsingExecution(session, searchParams, type);
  }

  private async resumeParsing(
    type: ParsingSessionType,
    searchParams: SearchAnimeParamsDto,
  ) {
    const session = await this.validateAndGetSession(type);
    if (!session) return;

    return this.handleParsingExecution(session, searchParams, type);
  }

  private async stopParsing(type: ParsingSessionType) {
    const session = await this.progressService.getLatestSession(type);

    if (!session || session.status !== ParsingSessionStatus.RUNNING) {
      this.logger.warn('Нет активной сессии для остановки парсинга');
      return { message: 'Нет активной сессии для остановки парсинга' };
    }

    await this.progressService.updateStatus(
      session.id,
      ParsingSessionStatus.PAUSED,
    );

    this.logger.log(`Парсинг ${type} принудительно остановлен`);
    return { message: `Парсинг ${type} успешно остановлен` };
  }

  private async validateAndGetSession(type: ParsingSessionType) {
    const session = await this.progressService.getLatestSession(type);

    if (
      !session ||
      session.status === ParsingSessionStatus.COMPLETED ||
      session.status === ParsingSessionStatus.FAILED
    ) {
      this.logger.warn(`Нет активной сессии для типа ${type}`);
      return null;
    }

    await this.progressService.updateStatus(
      session.id,
      ParsingSessionStatus.RUNNING,
    );
    return session;
  }

  private async handleParsingExecution(
    session: ParsingSession,
    searchParams: SearchAnimeParamsDto,
    type: ParsingSessionType,
  ) {
    this.logger.log(`Запущен парсинг ${this.PARSER_NAME} по типу ${type}`);
    try {
      await this.processParsing(session, searchParams, type);
    } catch (error) {
      this.logger.error(
        `Ошибка парсинга ${type}: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : undefined,
      );
      await this.progressService.updateStatus(
        session.id,
        ParsingSessionStatus.FAILED,
      );
      throw error;
    }
  }

  private async processParsing(
    session: ParsingSession,
    searchParams: SearchAnimeParamsDto,
    type: ParsingSessionType,
  ) {
    try {
      let hasMore: boolean = true;
      const activeStatuses: ParsingSessionStatus[] = [
        ParsingSessionStatus.CREATED,
        ParsingSessionStatus.RUNNING,
      ];

      while (hasMore) {
        const currentStatus: ParsingSessionStatus =
          await this.progressService.getSessionStatus(session.id);
        if (!currentStatus || !activeStatuses.includes(currentStatus)) {
          this.logger.warn(`Парсинг ${type} прерван, статус: ${currentStatus}`);
          break;
        }

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

      const finalStatus = await this.progressService.getSessionStatus(
        session.id,
      );
      if (finalStatus === ParsingSessionStatus.RUNNING) {
        await this.progressService.completeSession(session.id);
        this.logger.log(
          `Завершение парсинга ${this.PARSER_NAME} по типу ${type}`,
        );
      }
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
    let retries = this.MAX_RETRIES;
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

        const [kodikCheckResults, anilibriaCheckResults] = await Promise.all([
          Promise.all(
            animes.map((anime) =>
              this.kodikCheckService.checkByShikimoriId(Number(anime.id)),
            ),
          ),
          Promise.all(
            animes.map((anime) =>
              this.anilibriaCheckService.checkByAlias(
                getAnimeAliasSync(anime.url),
              ),
            ),
          ),
        ]);

        const checkedAnimes = animes.filter(
          (anime, index) =>
            !kodikCheckResults[index] || !anilibriaCheckResults[index],
        );
        await this.updateDbService.upsertAnimes(checkedAnimes);
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

  private getParsingConfig(type: ParsingSessionType, message: string) {
    switch (type) {
      case ParsingSessionType.UPDATE_ONGOINGS:
        return {
          type: ParsingSessionType.UPDATE_ONGOINGS,
          searchParams: this.ongoingSearchParams,
          successMessage: message,
        };
      case ParsingSessionType.UPDATE_THIS_YEAR:
        return {
          type: ParsingSessionType.UPDATE_THIS_YEAR,
          searchParams: this.currentYearSearchParams,
          successMessage: message,
        };
      case ParsingSessionType.CREATE_DATABASE:
        return {
          type: ParsingSessionType.CREATE_DATABASE,
          searchParams: this.defaultSearchParams,
          successMessage: message,
        };
      default:
        return null;
    }
  }

  private get defaultSearchParams() {
    return { limit: this.BATCH_LIMIT };
  }

  private get ongoingSearchParams() {
    return { ...this.defaultSearchParams, status: 'ongoing' };
  }

  private get currentYearSearchParams() {
    return {
      ...this.defaultSearchParams,
      season: `${new Date().getFullYear()}`,
    };
  }
}
