import { Injectable, Logger } from '@nestjs/common';
import { Anime, Prisma } from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { AnimeFromShikimori } from '../parsers/shikimori/shikimori-api/dto/anime.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateDbService {
  private readonly logger = new Logger(UpdateDbService.name);
  public constructor(private readonly prismaService: PrismaService) {}

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

  private mapShikimoriToAnimeCreateInput(
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ): Prisma.AnimeCreateInput {
    return {
      malId: animeData.malId,
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
      score: animeData.score,
      shikimoriScore: animeData.score,
      releasedOn: animeData.releasedOn.date,
      shikimoriUrl: animeData.url,
      season: animeData.season,
      isCensored: animeData.isCensored,
      rating: animeData.rating,
      nextEpisodeAt: animeData.nextEpisodeAt,
    };
  }

  private mapShikimoriToAnimeUpdateInput(
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ): Prisma.AnimeUpdateInput {
    return {
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
      score: animeData.score,
      shikimoriScore: animeData.score,
      releasedOn: animeData.releasedOn.date,
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
        const genreUpserts = animeData.genres.map(async (genre) => {
          if (!genre.name || !genre.russian) return;

          return tx.genre.upsert({
            where: { name: genre.name },
            create: { name: genre.name, russian: genre.russian },
            update: { russian: genre.russian },
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

  private async processRelatedAnimes(
    tx: Prisma.TransactionClient,
    anime: Anime,
    animeData: Omit<AnimeFromShikimori, 'created_at' | 'updated_at'>,
  ) {
    try {
      if (!animeData.related?.length) return;

      const createPromises = animeData.related.map(async (related) => {
        const shikimoriId = related.id.toString();

        // Генерация уникального имени с хэшем
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

      // Обработка связей
      const relationPromises = animeData.related.map(async (related) => {
        const relatedAnime = await tx.anime.findUnique({
          where: { shikimoriId: related.id.toString() },
        });

        if (!relatedAnime) {
          this.logger.warn(`Related anime not found: ${related.id}`);
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

      await Promise.all(relationPromises);
    } catch {
      this.logger.error(`Ошибка при обработке связанных аниме`);
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
      create: this.mapShikimoriToAnimeCreateInput(animeData),
      update: this.mapShikimoriToAnimeUpdateInput(animeData),
    });

    await Promise.all([
      this.processVideos(tx, anime, animeData),
      this.proccessScreenshots(tx, anime, animeData),
      this.processStudios(tx, anime, animeData),
      this.processGenres(tx, anime, animeData),
      this.processRelatedAnimes(tx, anime, animeData),
      this.processPosters(tx, anime, animeData),
    ]);

    this.logger.debug(`Обработано аниме ${anime.name}`);

    return anime;
  }
}
