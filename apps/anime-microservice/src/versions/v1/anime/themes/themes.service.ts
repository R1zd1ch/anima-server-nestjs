import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AnimeCacheKey,
  getAnimeCacheKey,
  getAnimeCacheTTL,
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { EpisodesService } from '../episodes/episodes.service';
import { Anime } from '@prisma/__generated__';
import { handleError } from 'shared/lib/utils/handle-error';
import { buildPagination } from 'shared/lib/utils/build-pagination';
import { buildMeta } from 'shared/lib/utils/build-meta';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getThemes() {
    try {
      const themes = await this.prismaService.theme.findMany();

      const themesWithCount = await Promise.all(
        themes.map(async (theme) => {
          const total = await this.prismaService.anime.count({
            where: {
              ...shikimoriScoreNotNull,
              theme: { some: { themeId: theme.id } },
            },
          });

          return { ...theme, total };
        }),
      );

      return themesWithCount;
    } catch (error) {
      handleError(error, 'Ошибка при получении тем', this.logger);
    }
  }

  public async getThemeById(requestId: number) {
    try {
      const cacheKey = getAnimeCacheKey(
        AnimeCacheKey.THEMES,
        requestId.toString(),
      );

      const cachedData = await this.cacheManager.get<{
        id: string;
        requestId: number;
        name: string;
        russian: string;
        totalAnimes: number;
      }>(cacheKey);

      if (cachedData) return cachedData;

      const totalAnimes = await this.prismaService.anime.count({
        where: {
          ...shikimoriScoreNotNull,
          theme: { some: { theme: { requestId: requestId } } },
        },
      });

      const theme = await this.prismaService.theme.findUnique({
        where: { requestId: requestId },
      });

      const response = { ...theme, totalAnimes };

      await this.cacheManager.set(
        cacheKey,
        response,
        getAnimeCacheTTL(AnimeCacheKey.THEMES),
      );

      return response;
    } catch (e) {
      handleError(e, 'Ошибка при получении темы', this.logger);
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
        where: { requestId: { in: selectedThemes } },
      });
    } catch (error) {
      handleError(error, 'Ошибка при получении случайных тем', this.logger);
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

      const cacheKey = getAnimeCacheKey(
        AnimeCacheKey.THEMES,
        `${requestId}-${page}-${limit}`,
      );

      const cachedData = await this.cacheManager.get<{
        data: Anime[];
        meta: {
          total: number;
          page: number;
          limit: number;
        };
      }>(cacheKey);

      if (cachedData) return cachedData;

      const whereClause = {
        ...shikimoriScoreNotNull,
        theme: { some: { theme: { requestId: requestId } } },
      };

      const [animesFromTheme, total] = await Promise.all([
        this.prismaService.anime.findMany({
          where: whereClause,
          include: {
            ...includeSmall,
          },
          ...buildPagination(page, limit),
        }),
        this.prismaService.anime.count({
          where: whereClause,
        }),
      ]);

      const response = {
        data: animesFromTheme,
        meta: buildMeta(total, page, limit),
      };

      await this.cacheManager.set(
        cacheKey,
        response,
        getAnimeCacheTTL(AnimeCacheKey.THEMES),
      );

      return response;
    } catch (e) {
      handleError(e, 'Ошибка при получении аниме по теме', this.logger);
    }
  }

  public async getRandomAnimeFromTheme(requestId: number) {
    try {
      let release: Anime | null = null;

      const allIds = await this.prismaService.anime.findMany({
        where: {
          ...shikimoriScoreNotNull,
          theme: { some: { theme: { requestId: requestId } } },
        },
        select: { shikimoriId: true },
      });

      while (release === null || release.shikimoriScore === null) {
        const randomId =
          allIds[Math.floor(Math.random() * allIds.length)].shikimoriId;

        const randomAnime = await this.prismaService.anime.findUnique({
          where: { shikimoriId: randomId },
          include: includeAll,
        });

        if (randomAnime) release = randomAnime;
      }

      const episodes = await this.episodesService.getEpisodes(
        release?.alias,
        Number(release.shikimoriId || 0),
      );
      return { ...release, ...episodes };
    } catch (error) {
      handleError(
        error,
        'Ошибка при получении случайного аниме по теме',
        this.logger,
      );
    }
  }
}
