import { Injectable, Logger } from '@nestjs/common';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { EpisodesService } from '../episodes/episodes.service';
import { Anime } from '@prisma/__generated__';

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
  ) {}

  public async getThemes() {
    try {
      const themes = await this.prismaService.theme.findMany();

      const themesWithCount = await Promise.all(
        themes.map(async (theme) => {
          const total = await this.prismaService.anime.count({
            where: {
              ...shikimoriScoreNotNull,
              theme: {
                some: {
                  themeId: theme.id,
                },
              },
            },
          });

          return {
            ...theme,
            total,
          };
        }),
      );

      return themesWithCount;
    } catch (error) {
      this.logger.log(
        `Ошибка получения всех тем: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getThemeById(requestId: number) {
    try {
      const totalAnimes = await this.prismaService.anime.count({
        where: {
          ...shikimoriScoreNotNull,
          theme: {
            some: {
              theme: {
                requestId: requestId,
              },
            },
          },
        },
      });

      const theme = await this.prismaService.theme.findUnique({
        where: {
          requestId: requestId,
        },
      });
      return { ...theme, totalAnimes };
    } catch (error) {
      this.logger.log(
        `Ошибка получения темы по id: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getRandomTheme(count: number = 1) {
    try {
      const allThemes = await this.prismaService.theme.findMany({
        select: { requestId: true },
      });

      if (allThemes.length === 0) return [];

      const actualCount = Math.min(count, allThemes.length);

      const selectedThemes = [];
      const availableThemes = [...allThemes];

      for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableThemes.length);
        selectedThemes.push(availableThemes[randomIndex].requestId);
        availableThemes.splice(randomIndex, 1);
      }

      return this.prismaService.theme.findMany({
        where: {
          requestId: {
            in: selectedThemes,
          },
        },
      });
    } catch (error) {
      this.logger.log(
        `Ошибка получения случайных тем: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getAnimeFromTheme(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
    try {
      const page = pageFromQuery || 1;
      const limit = Math.min(limitFromQuery || 1, 50);

      const skip = (page - 1) * limit;

      const whereClause = {
        ...shikimoriScoreNotNull,
        theme: {
          some: {
            theme: {
              requestId: requestId,
            },
          },
        },
      };

      const [animesFromTheme, total] = await Promise.all([
        this.prismaService.anime.findMany({
          where: whereClause,
          include: {
            ...includeSmall,
          },
          skip,
          take: limit,
        }),
        this.prismaService.anime.count({
          where: whereClause,
        }),
      ]);

      return {
        data: animesFromTheme,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.log(
        `Ошибка получения аниме по теме: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getRandomAnimeFromTheme(requestId: number) {
    try {
      let release: Anime | null = null;

      const allIds = await this.prismaService.anime.findMany({
        where: {
          ...shikimoriScoreNotNull,
          theme: {
            some: {
              theme: {
                requestId: requestId,
              },
            },
          },
        },
        select: {
          shikimoriId: true,
        },
      });

      while (release === null || release.shikimoriScore === null) {
        const randomId =
          allIds[Math.floor(Math.random() * allIds.length)].shikimoriId;

        const randomAnime = await this.prismaService.anime.findUnique({
          where: { shikimoriId: randomId },
          include: {
            ...includeAll,
          },
        });

        if (randomAnime) {
          release = randomAnime;
        }
      }

      const episodes = await this.episodesService.getEpisodes(
        release?.alias,
        Number(release.shikimoriId || 0),
      );
      return { ...release, ...episodes };
    } catch (error) {
      this.logger.log(
        `Ошибка получения случайного аниме по теме: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }
}
