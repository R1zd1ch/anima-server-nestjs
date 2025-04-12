import { Injectable, Logger } from '@nestjs/common';
import { ShikimoriService } from '../shikimori-api/shikimori.service';
import { ProgressService } from '../../save-progress/save-progress.service';
import { Anime, ParsingSessionStatus } from '@prisma/__generated__';
import { ShikimoriAnime } from '../shikimori-api/dto/anime-id.dto';
import { UpdateDbService } from 'apps/update-anime/src/update-db/update-db.service';

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

  async startParsing() {
    const session = await this.progressService.initializeSession(
      this.PARSER_NAME,
    );

    await this.progressService.updateStatus(
      session.id,
      ParsingSessionStatus.RUNNING,
    );
    this.logger.debug('Начало парсинга');

    try {
      let hasMore: boolean = true;

      while (hasMore) {
        const currentPage = await this.progressService.getCurrentPage(
          session.id,
        );
        const nextPage = currentPage + 1;

        const animes_chank = await this.parseBatch(session.id, nextPage);

        hasMore =
          animes_chank.length !== null &&
          animes_chank.length >= this.BATCH_LIMIT;
      }
    } catch {
      await this.progressService.updateStatus(
        session.id,
        ParsingSessionStatus.FAILED,
      );

      this.logger.error('Parsing session failed');
    }
  }

  async resumeParsing() {
    const session = await this.progressService.getLatestSession();

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
    this.logger.debug('Возобновление парсинга');

    try {
      let hasMore = true;

      while (hasMore) {
        const currentPage = await this.progressService.getCurrentPage(
          session.id,
        );
        const nextPage = currentPage + 1;

        const animes_chank = await this.parseBatch(session.id, nextPage);

        hasMore =
          animes_chank.length !== null &&
          animes_chank.length >= this.BATCH_LIMIT;
      }
    } catch {
      await this.progressService.updateStatus(
        session.id,
        ParsingSessionStatus.FAILED,
      );

      this.logger.error('Parsing session failed');
    }
  }

  private async parseBatch(sessionId: number, page: number) {
    let retries = 3;
    let processedItems = 0;
    const animes = [] as ShikimoriAnime[];

    while (retries > 0) {
      try {
        const animeList = await this.shikimoriService.getAnimeList({
          page,
          limit: this.BATCH_LIMIT,
          order: 'id',
        });

        if (!animeList || animeList.length === 0) {
          return null;
        }

        for (const animeItem of animeList) {
          let retries = 3;
          let success = false;
          let interval = 1000;

          while (retries > 0 && !success) {
            try {
              const anime = await this.shikimoriService.getAnimeById(
                animeItem.id,
              );

              this.logger.log(`Успешно обработано: ${anime.name}`);

              animes.push(anime);
              processedItems += 1;
              success = true;
            } catch (e) {
              retries--;
              this.logger.warn(
                `Ошибка обработки аниме ${animeItem.id}, попыток осталось: ${retries}, ${e}`,
              );

              if (retries === 0) {
                this.logger.error(
                  `Аниме ${animeItem.id} пропущено после 3 неудач, ${e}`,
                );
              } else {
                await new Promise((resolve) => setTimeout(resolve, interval));
                interval *= 10;
              }
            }
          }
        }
        await this.progressService.updateProgress(
          sessionId,
          page,
          processedItems,
        );
        const parsedAnimes = this.compressAnimes(animes);
        this.logger.debug(
          `Аниме с пачки (страница ${page}) распаршены, количество: ${animes.length}`,
        );
        await this.updateDbService.upsertAnimes(parsedAnimes);
        this.logger.debug(`Обработана пачка (страница ${page})`);
        return animes;
      } catch (e) {
        retries--;
        this.logger.error(
          `Ошибка пачки (страница ${page}), попыток осталось: ${retries}, ${e}`,
        );

        if (retries === 0) {
          throw new Error(
            `Не удалось обработать пачку (страница ${page}), ${e}`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, this.BATCH_TIME));
      }
    }
  }

  public compressAnime(
    shikimoriAnime: ShikimoriAnime,
  ): Omit<Anime, 'created_at' | 'updated_at'> {
    return {
      id: shikimoriAnime.id,
      name: shikimoriAnime.name,
      russian: shikimoriAnime.russian || null,
      image: shikimoriAnime.image,
      url: shikimoriAnime.url,
      kind: shikimoriAnime.kind,
      score: shikimoriAnime.score,
      status: shikimoriAnime.status,
      episodes: shikimoriAnime.episodes,
      episodes_aired: shikimoriAnime.episodes_aired,
      aired_on: shikimoriAnime.aired_on
        ? new Date(shikimoriAnime.aired_on)
        : null,
      released_on: shikimoriAnime.released_on
        ? new Date(shikimoriAnime.released_on)
        : null,
      rating: shikimoriAnime.rating || null,
      english: shikimoriAnime.english.filter((e): e is string => e !== null),
      synonyms: shikimoriAnime.synonyms,
      license_name_ru: shikimoriAnime.license_name_ru || null,
      duration: shikimoriAnime.duration || 0,
      description: shikimoriAnime.description?.substring(0, 3000) || null,
      franchise: shikimoriAnime.franchise || null,
      favoured: shikimoriAnime.favoured || false,
      anons: shikimoriAnime.anons || false,
      ongoing: shikimoriAnime.ongoing || false,
      thread_id: shikimoriAnime.thread_id,
      topic_id: shikimoriAnime.topic_id,
      myanimelist_id: shikimoriAnime.myanimelist_id,
      next_episode_at: shikimoriAnime.next_episode_at
        ? new Date(shikimoriAnime.next_episode_at)
        : null,
      fansubbers: shikimoriAnime.fansubbers,
      fandubbers: shikimoriAnime.fandubbers,
      licensors: shikimoriAnime.licensors,
      genres: shikimoriAnime.genres.map((g) => g.name),
      studios: shikimoriAnime.studios.map((s) => s.name),
      videos: shikimoriAnime.videos.map((v) => v.url),
      screenshots: shikimoriAnime.screenshots.map((s) => s.original),
    };
  }

  public compressAnimes(
    shikimoriAnimes: ShikimoriAnime[],
  ): Omit<Anime, 'created_at' | 'updated_at'>[] {
    return shikimoriAnimes.map((a) => this.compressAnime(a));
  }
}
