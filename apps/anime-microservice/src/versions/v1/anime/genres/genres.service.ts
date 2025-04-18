import { Injectable, Logger } from '@nestjs/common';
import {
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class GenresService {
  private readonly logger = new Logger(GenresService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async getGenres() {
    const genres = await this.prismaService.genre.findMany();

    const genresWithCount = await Promise.all(
      genres.map(async (genre) => {
        const totalAnimes = await this.prismaService.anime.count({
          where: {
            ...shikimoriScoreNotNull,
            genres: {
              some: {
                genreId: genre.id,
              },
            },
          },
        });

        return {
          ...genre,
          totalAnimes,
        };
      }),
    );

    return genresWithCount;
  }

  public async getGenreById(requestId: number) {
    const totalAnimes = await this.prismaService.anime.count({
      where: {
        ...shikimoriScoreNotNull,
        genres: {
          some: {
            genre: {
              requestId: requestId,
            },
          },
        },
      },
    });
    const genre = await this.prismaService.genre.findUnique({
      where: {
        requestId: requestId,
      },
    });
    return { ...genre, totalAnimes };
  }

  public async getRandomGenre(count: number = 1): Promise<any[]> {
    const allGenres = await this.prismaService.genre.findMany({
      select: { requestId: true },
    });

    if (allGenres.length === 0) {
      return [];
    }

    const actualCount = Math.min(count, allGenres.length);

    const selectedGenres = [];
    const availableGenres = [...allGenres];

    for (let i = 0; i < actualCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableGenres.length);
      selectedGenres.push(availableGenres[randomIndex].requestId);
      availableGenres.splice(randomIndex, 1);
    }

    return this.prismaService.genre.findMany({
      where: {
        requestId: {
          in: selectedGenres,
        },
      },
    });
  }

  public async getAnimeFromGenre(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
    const page = pageFromQuery || 1;
    const limit = Math.min(limitFromQuery || 1, 50);

    this.logger.log(`Getting anime from genreId=${requestId}`);
    const skip = (page - 1) * limit;

    const whereClause = {
      ...shikimoriScoreNotNull,
      genres: {
        some: {
          genre: {
            requestId: requestId,
          },
        },
      },
    };

    const [animesFromGenre, total] = await Promise.all([
      this.prismaService.anime.findMany({
        where: whereClause,
        include: {
          ...includeSmall,
        },
        take: limit,
        skip,
      }),
      this.prismaService.anime.count({ where: whereClause }),
    ]);

    this.logger.log(
      `Found ${animesFromGenre.length} anime(s) for genreId=${requestId}`,
    );

    return {
      data: animesFromGenre,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
