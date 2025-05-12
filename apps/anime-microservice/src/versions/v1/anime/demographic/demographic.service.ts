import { Injectable, Logger } from '@nestjs/common';
import { Anime } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';

import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { EpisodesService } from '../episodes/episodes.service';
import { handleError } from 'shared/lib/utils/handle-error';
import { buildPagination } from 'shared/lib/utils/build-pagination';
import { buildMeta } from 'shared/lib/utils/build-meta';

@Injectable()
export class DemographicService {
  private readonly logger = new Logger(DemographicService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
  ) {}

  public async getDemographics() {
    try {
      const demographics = await this.prismaService.demographic.findMany();

      const demographicsWithCount = await Promise.all(
        demographics.map(async (demographic) => {
          const totalAnimes = await this.prismaService.anime.count({
            where: {
              ...shikimoriScoreNotNull,
              demographic: { some: { demographicId: demographic.id } },
            },
          });

          return { ...demographic, totalAnimes };
        }),
      );
      return demographicsWithCount;
    } catch (error) {
      handleError(error, 'Ошибка получения демографий', this.logger);
    }
  }

  public async getDemographicById(requestId: number) {
    try {
      const totalAnimes = await this.prismaService.anime.count({
        where: {
          ...shikimoriScoreNotNull,
          demographic: { some: { demographic: { requestId: requestId } } },
        },
      });
      const demographic = await this.prismaService.demographic.findUnique({
        where: { requestId: requestId },
      });
      return { ...demographic, totalAnimes };
    } catch (error) {
      handleError(error, 'Ошибка получения демографии', this.logger);
    }
  }

  public async getRandomDemographic(count: number = 1) {
    try {
      const allDemographics = await this.prismaService.demographic.findMany({
        select: { requestId: true },
      });

      if (allDemographics.length === 0) return [];

      const actualCount = Math.min(count, allDemographics.length);

      const selectedDemographics = [];
      const availableDemographics = [...allDemographics];

      for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(
          Math.random() * availableDemographics.length,
        );
        selectedDemographics.push(availableDemographics[randomIndex].requestId);
        availableDemographics.splice(randomIndex, 1);
      }

      if (selectedDemographics.length === 0) return [];

      const demographic = this.prismaService.demographic.findMany({
        where: { requestId: { in: selectedDemographics } },
      });

      return demographic;
    } catch (error) {
      handleError(error, 'Ошибка получения случайных демографий', this.logger);
    }
  }

  public async getAnimeFromDemographic(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
    try {
      const page = pageFromQuery || 1;
      const limit = Math.min(limitFromQuery || 1, 50);

      this.logger.log(`Getting anime from demographicId=${requestId}`);

      const whereClause = {
        ...shikimoriScoreNotNull,
        demographic: { some: { demographic: { requestId: requestId } } },
      };

      const [animesFromDemographic, total] = await Promise.all([
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

      return {
        data: animesFromDemographic,
        meta: buildMeta(total, page, limit),
      };
    } catch (error) {
      handleError(error, 'Ошибка получения аниме по демографии', this.logger);
    }
  }

  public async getRandomAnimeFromDemographic(requestId: number) {
    try {
      let release: Anime | null = null;

      const allIds = await this.prismaService.anime.findMany({
        where: {
          ...shikimoriScoreNotNull,
          demographic: { some: { demographic: { requestId: requestId } } },
        },
        select: { shikimoriId: true },
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

        if (randomAnime) release = randomAnime;
      }

      const episodes = await this.episodesService.getEpisodes(
        release?.alias,
        Number(release?.shikimoriId || 0),
      );

      return { ...release, ...episodes };
    } catch (error) {
      handleError(error, 'Ошибка получения случайного аниме', this.logger);
    }
  }
}
