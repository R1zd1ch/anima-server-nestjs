import { Injectable, Logger } from '@nestjs/common';
import { Anime, Prisma } from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { AnimeFromShikimori } from '../parsers/shikimori/shikimori-api/dto/anime.dto';
import { randomUUID } from 'crypto';
import { getAlias } from 'apps/update-anime-microservice/src/lib/utils/get-anime-alias';
import { KodikCheckService } from '../check-cdn/kodik-check.service';

@Injectable()
export class UpdateDbService {
  private readonly logger = new Logger(UpdateDbService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly kodikCheckService: KodikCheckService,
  ) {}

  async upsertAnimes(
    animes: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>[],
  ): Promise<Anime[]> {
    try {
      if (!animes.length) return [];

      return await this.prismaService.$transaction(
        async (tx) => {
          const results: Anime[] = [];
          for (const animeData of animes) {
            const anime = await this.processAnime(tx, animeData);
            results.push(anime);
          }
          return results;
        },
        { timeout: 30000 },
      );
    } catch (error) {
      this.logger.error(`Произошла ошибка при сохранении пачки аниме`);
      throw new Error(`Произошла ошибка при сохранении пачки аниме ${error}`);
    }
  }

  private async mapShikimoriToAnimeCreateInput(
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ): Promise<Prisma.AnimeCreateInput> {
    const alias = await getAlias(animeData.url);
    return {
      malId: animeData.malId,
      alias: alias || null,
      shikimoriId: animeData.id.toString(),
      name: animeData.name,
      description: animeData.description,
      russian: animeData.russian,
      english: animeData.english,
      japanese: animeData.japanese,
      synonyms: animeData.synonyms,
      status: animeData.status,
      kind: animeData.kind,
      episodes: animeData.episodes,
      episodesAired: animeData.episodesAired,
      duration: animeData.duration,
      score: 0,
      shikimoriScore: animeData.score,
      releasedOn: animeData.releasedOn.date,
      airedOn: animeData.airedOn.date,
      shikimoriUrl: animeData.url,
      season: animeData.season,
      isCensored: animeData.isCensored,
      rating: animeData.rating,
      nextEpisodeAt: animeData.nextEpisodeAt,
    };
  }

  private async mapShikimoriToAnimeUpdateInput(
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ): Promise<Prisma.AnimeUpdateInput> {
    const alias = await getAlias(animeData.url);
    return {
      name: animeData.name,
      alias: alias || null,
      description: animeData.description,
      russian: animeData.russian,
      english: animeData.english,
      japanese: animeData.japanese,
      synonyms: animeData.synonyms,
      status: animeData.status,
      kind: animeData.kind,
      episodes: animeData.episodes,
      episodesAired: animeData.episodesAired,
      duration: animeData.duration,
      shikimoriScore: animeData.score,
      releasedOn: animeData.releasedOn.date,
      airedOn: animeData.airedOn.date,
      shikimoriUrl: animeData.url,
      season: animeData.season,
      isCensored: animeData.isCensored,
      rating: animeData.rating,
      nextEpisodeAt: animeData.nextEpisodeAt,
    };
  }

  private async processVideos(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.videos?.length) {
        await tx.animeVideo.deleteMany({ where: { animeId: anime.id } });

        const videosUpserts = animeData.videos.map(async (video) =>
          tx.video.upsert({
            where: { shikimoriId: video.id },
            create: {
              shikimoriId: video.id,
              name: video.name,
              url: video.url,
              kind: video.kind,
              playerUrl: video.playerUrl,
              imageUrl: video.imageUrl,
            },
            update: {
              name: video.name,
              url: video.url,
              playerUrl: video.playerUrl,
              imageUrl: video.imageUrl,
            },
          }),
        );

        const videos = await Promise.all(videosUpserts);

        await tx.animeVideo.createMany({
          data: videos.map((v) => ({
            videoId: v.id,
            animeId: anime.id,
          })),
        });
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке видео аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке скриншотов аниме');
    }
  }

  private async proccessScreenshots(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.screenshots?.length) {
        await tx.animeScreenshot.deleteMany({ where: { animeId: anime.id } });

        const screenshotUpserts = animeData.screenshots.map(
          async (screenshot) =>
            tx.screenshots.upsert({
              where: { shikimoriId: screenshot.id },
              create: {
                shikimoriId: screenshot.id,
                originalUrl: screenshot.originalUrl,
                x332Url: screenshot.x332Url,
              },
              update: {
                originalUrl: screenshot.originalUrl,
                x332Url: screenshot.x332Url,
              },
            }),
        );

        const screenshots = await Promise.all(screenshotUpserts);

        await tx.animeScreenshot.createMany({
          data: screenshots.map((s) => ({
            animeId: anime.id,
            screenshotId: s.id,
          })),
        });
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке скриншотов аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке скриншотов аниме');
    }
  }

  private async processStudios(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.studios?.length) {
        const genreUpserts = animeData.studios.map(async (studio) => {
          if (!studio.name) return;

          return tx.studio.upsert({
            where: { name: studio.name },
            create: { name: studio.name, imageUrl: studio.imageUrl },
            update: { imageUrl: studio.imageUrl },
          });
        });

        const studios = await Promise.all(genreUpserts);

        const animeStudios = studios.map(async (s) => {
          return tx.animeStudio.upsert({
            where: { animeId_studioId: { studioId: s.id, animeId: anime.id } },
            create: { studioId: s.id, animeId: anime.id },
            update: {},
          });
        });

        await Promise.all(animeStudios);
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке студий аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке студий аниме');
    }
  }

  private async processGenres(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.genres?.length) {
        const genreKind = 'genre';
        const filteredGenres = animeData.genres.filter(
          (g) => String(g.kind) === genreKind,
        );
        if (!filteredGenres.length) return;

        const genreUpserts = filteredGenres.map(async (genre) => {
          if (!genre.name || !genre.russian) return;

          return tx.genre.upsert({
            where: { name: genre.name },
            create: { name: genre.name, russian: genre.russian },
            update: {},
          });
        });

        const genres = await Promise.all(genreUpserts);

        const animeGenres = genres.map(async (g) => {
          return tx.animeGenre.upsert({
            where: {
              animeId_genreId: {
                animeId: anime.id,
                genreId: g.id,
              },
            },
            create: { genreId: g.id, animeId: anime.id },
            update: { genreId: g.id, animeId: anime.id },
          });
        });

        await Promise.all(animeGenres);
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке жанров аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке жанров аниме');
    }
  }

  private async processDemographics(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.genres?.length) {
        const genreKind = 'demographic';
        const filteredDemographic = animeData.genres.filter(
          (g) => String(g.kind) === genreKind,
        );
        if (!filteredDemographic.length) return;

        const demographicUpserts = filteredDemographic.map(async (d) => {
          if (!d.name || !d.russian) return;

          return tx.demographic.upsert({
            where: { name: d.name },
            create: { name: d.name, russian: d.russian },
            update: {},
          });
        });

        const demographics = await Promise.all(demographicUpserts);

        const animeDemographics = demographics.map(async (d) => {
          return tx.animeDemographic.upsert({
            where: {
              animeId_demographicId: {
                animeId: anime.id,
                demographicId: d.id,
              },
            },
            create: { demographicId: d.id, animeId: anime.id },
            update: { demographicId: d.id, animeId: anime.id },
          });
        });

        await Promise.all(animeDemographics);
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке демографии аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке демографии аниме');
    }
  }

  private async processThemes(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (animeData.genres?.length) {
        const genreKind = 'theme';
        const filteredThemes = animeData.genres.filter(
          (g) => String(g.kind) === genreKind,
        );
        if (!filteredThemes.length) return;

        const themesUpserts = filteredThemes.map(async (t) => {
          if (!t.name || !t.russian) return;

          return tx.theme.upsert({
            where: { name: t.name },
            create: { name: t.name, russian: t.russian },
            update: {},
          });
        });

        const themes = await Promise.all(themesUpserts);

        const animeThemes = themes.map(async (t) => {
          return tx.animeTheme.upsert({
            where: {
              animeId_themeId: {
                animeId: anime.id,
                themeId: t.id,
              },
            },
            create: { themeId: t.id, animeId: anime.id },
            update: { themeId: t.id, animeId: anime.id },
          });
        });

        await Promise.all(animeThemes);
      }
    } catch {
      this.logger.error(
        `Произошла ошибка при обработке тем аниме ${anime.name}`,
      );
      throw new Error('Произошла ошибка при обработке тем аниме');
    }
  }

  private async processRelatedAnimes(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (!animeData.related || animeData.related.length === 0) {
        this.logger.debug('No related animes found', 'processRelatedAnimes');
        return;
      }

      if (!this.kodikCheckService) {
        this.logger.error(
          'kodikCheckService is not initialized',
          'processRelatedAnimes',
        );
        return;
      }

      const kodikCheckResults = await Promise.all(
        animeData.related.map(async (relatedAnime) => {
          const shikimoriId = relatedAnime.anime?.id;
          if (!shikimoriId) {
            this.logger.warn(
              'Invalid related anime data',
              'processRelatedAnimes',
            );
            return false;
          }

          try {
            const result = await this.kodikCheckService.checkByShikimoriId(
              Number(shikimoriId),
            );
            if (!result) {
              this.logger.warn(
                `⚠️ Не найдено на Kodik: Shikimori ID ${shikimoriId}`,
              );
            } else {
              this.logger.log(
                `✅ Найдено на Kodik: Shikimori ID ${shikimoriId}`,
              );
            }
            return result;
          } catch (error) {
            this.logger.error(
              `Ошибка при проверке Kodik для ID ${shikimoriId}: ${error}`,
              'processRelatedAnimes',
            );
            return false;
          }
        }),
      );

      // ✅ Сохраняем только те, что найдены на Kodik
      const checkedAnimes = animeData.related.filter(
        (anime, index) => kodikCheckResults[index],
      );

      const createPromises = checkedAnimes.map(async (related) => {
        const shikimoriId = related.id.toString();
        const season = related.anime?.season;

        if (season && !this.isValidSeason(season)) {
          this.logger.log(
            `⏩ Пропускаем ${shikimoriId} — некорректный сезон: ${season}`,
          );
          return;
        }

        const name = related.anime?.name || `Unknown_${randomUUID()}`;
        return tx.anime.upsert({
          where: { shikimoriId },
          create: {
            shikimoriId,
            name,
            status: 'anons',
            episodes: 0,
            episodesAired: 0,
          },
          update: {
            name: related.anime?.name,
          },
        });
      });

      await Promise.all(createPromises);

      const filteredRelations = checkedAnimes.filter((related) =>
        this.isValidSeason(related.anime?.season),
      );

      const relationPromises = filteredRelations.map(async (related) => {
        const relatedAnime = await tx.anime.findUnique({
          where: { shikimoriId: related.id.toString() },
        });

        if (!relatedAnime) {
          this.logger.warn(`⚠️ Related anime не найдено в БД: ${related.id}`);
          return;
        }

        return tx.relatedAnime.upsert({
          where: {
            animeId_relatedAnimeId: {
              animeId: anime.id,
              relatedAnimeId: relatedAnime.id,
            },
          },
          create: {
            animeId: anime.id,
            relatedAnimeId: relatedAnime.id,
            relationKind: related.relationKind,
          },
          update: {
            relationKind: related.relationKind,
          },
        });
      });

      await Promise.all(relationPromises);
    } catch (error) {
      this.logger.error(`❌ Ошибка при обработке связанных аниме: ${error}`);
      throw new Error('Ошибка при обработке связанных аниме');
    }
  }

  private async processPosters(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    if (animeData.poster) {
      await tx.animePoster.deleteMany({ where: { animeId: anime.id } });

      const posterData = {
        shikimoriId: animeData.poster.id.toString(),
        originalUrl: animeData.poster.originalUrl,
        mainUrl: animeData.poster.mainUrl,
        animeId: anime.id,
      };

      await tx.animePoster.create({
        data: posterData,
      });
    }
  }

  private async processAnime(
    tx: Prisma.TransactionClient,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    const anime = await tx.anime.upsert({
      where: { shikimoriId: animeData.id.toString() },
      create: await this.mapShikimoriToAnimeCreateInput(animeData),
      update: await this.mapShikimoriToAnimeUpdateInput(animeData),
    });

    await Promise.all([
      this.processVideos(tx, anime, animeData),
      this.proccessScreenshots(tx, anime, animeData),
      this.processStudios(tx, anime, animeData),
      this.processGenres(tx, anime, animeData),
      this.processDemographics(tx, anime, animeData),
      this.processThemes(tx, anime, animeData),
      this.processPosters(tx, anime, animeData),
    ]);

    this.logger.debug(`Обработано аниме ${anime.name}`);

    return anime;
  }

  private isValidSeason(season?: string): boolean {
    if (!season) return false;

    const yearPatterns = [
      { regex: /_(\d{4})$/, extract: (m: RegExpMatchArray) => parseInt(m[1]) },
      {
        regex: /^(\d{4})_(\d{4})$/,
        extract: (m: RegExpMatchArray) =>
          Math.min(parseInt(m[1]), parseInt(m[2])),
      },
      {
        regex: /^(\d{3})x$/,
        extract: (m: RegExpMatchArray) => parseInt(m[1]) * 10,
      },
      { regex: /^(\d{4})$/, extract: (m: RegExpMatchArray) => parseInt(m[1]) },
    ];

    for (const pattern of yearPatterns) {
      const match = season.match(pattern.regex);
      if (match) {
        const year = pattern.extract(match);
        return year >= 1995;
      }
    }

    return false;
  }
}
