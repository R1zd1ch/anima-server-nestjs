import { Injectable, Logger } from '@nestjs/common';
import { Anime } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { EpisodesService } from '../episodes/episodes.service';
import { buildPagination } from 'shared/lib/utils/build-pagination';
import { buildMeta } from 'shared/lib/utils/build-meta';
import { handleError } from 'shared/lib/utils/handle-error';

@Injectable()
export class GenresService {
  private readonly logger = new Logger(GenresService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
  ) {}

  public async getGenres() {
    try {
      const genres = await this.prismaService.genre.findMany();

      const genresWithCount = await Promise.all(
        genres.map(async (genre) => {
          const totalAnimes = await this.prismaService.anime.count({
            where: {
              ...shikimoriScoreNotNull,
              genres: { some: { genreId: genre.id } },
            },
          });

          return { ...genre, totalAnimes };
        }),
      );

      return genresWithCount;
    } catch (e) {
      handleError(e, 'Ошибка при получении жанров', this.logger);
    }
  }

  public async getGenreById(requestId: number) {
    try {
      const totalAnimes = await this.prismaService.anime.count({
        where: {
          ...shikimoriScoreNotNull,
          genres: { some: { genre: { requestId: requestId } } },
        },
      });
      const genre = await this.prismaService.genre.findUnique({
        where: { requestId: requestId },
      });
      return { ...genre, totalAnimes };
    } catch (e) {
      handleError(e, 'Ошибка при получении жанра по id', this.logger);
    }
  }

  public async getRandomGenre(count: number = 1): Promise<any[]> {
    try {
      const allGenres = await this.prismaService.genre.findMany({
        select: { requestId: true },
      });

      if (allGenres.length === 0) return [];

      const actualCount = Math.min(count, allGenres.length);

      const selectedGenres = [];
      const availableGenres = [...allGenres];

      for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableGenres.length);
        selectedGenres.push(availableGenres[randomIndex].requestId);
        availableGenres.splice(randomIndex, 1);
      }

      return this.prismaService.genre.findMany({
        where: { requestId: { in: selectedGenres } },
      });
    } catch (e) {
      handleError(e, 'Ошибка при получении случайных жанров', this.logger);
    }
  }

  public async getAnimeFromGenre(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
    try {
      const page = pageFromQuery || 1;
      const limit = Math.min(limitFromQuery || 1, 50);

      this.logger.log(`Getting anime from genreId=${requestId}`);

      const whereClause = {
        ...shikimoriScoreNotNull,
        genres: { some: { genre: { requestId: requestId } } },
      };

      const [animesFromGenre, total] = await Promise.all([
        this.prismaService.anime.findMany({
          where: whereClause,
          include: { ...includeSmall },
          ...buildPagination(page, limit),
        }),
        this.prismaService.anime.count({ where: whereClause }),
      ]);

      this.logger.log(
        `Found ${animesFromGenre.length} anime(s) for genreId=${requestId}`,
      );

      return {
        data: animesFromGenre,
        meta: buildMeta(page, limit, total),
      };
    } catch (e) {
      handleError(e, 'Ошибка при получении аниме по жанру', this.logger);
    }
  }

  public async getRandomAnimeFromGenre(requestId: number) {
    try {
      let release: Anime | null = null;

      const allIds = await this.prismaService.anime.findMany({
        where: {
          ...shikimoriScoreNotNull,
          genres: { some: { genre: { requestId: requestId } } },
        },
        select: { shikimoriId: true },
      });

      while (release === null || release.shikimoriScore === null) {
        const randomId =
          allIds[Math.floor(Math.random() * allIds.length)].shikimoriId;

        const randomAnime = await this.prismaService.anime.findUnique({
          where: { shikimoriId: randomId },
          include: { ...includeAll },
        });

        if (randomAnime) release = randomAnime;
      }

      const episodes = await this.episodesService.getEpisodes(
        release?.alias,
        Number(release?.shikimoriId || 0),
      );
      return { ...release, ...episodes };
    } catch (e) {
      handleError(
        e,
        'Ошибка при получении случайного аниме по жанру',
        this.logger,
      );
    }
  }
}
