import { Injectable, Logger } from '@nestjs/common';
import { Anime } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';

import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { EpisodesService } from '../episodes/episodes.service';

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
              demographic: {
                some: {
                  demographicId: demographic.id,
                },
              },
            },
          });

          return {
            ...demographic,
            totalAnimes,
          };
        }),
      );

      return demographicsWithCount;
    } catch (error) {
      this.logger.log(
        `Ошибка получения демографий: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getDemographicById(requestId: number) {
    try {
      const totalAnimes = await this.prismaService.anime.count({
        where: {
          ...shikimoriScoreNotNull,
          demographic: {
            some: {
              demographic: {
                requestId: requestId,
              },
            },
          },
        },
      });
      const demographic = await this.prismaService.demographic.findUnique({
        where: {
          requestId: requestId,
        },
      });
      return { ...demographic, totalAnimes };
    } catch (error) {
      this.logger.log(
        `Ошибка получения демографии по id: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
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

      return this.prismaService.genre.findMany({
        where: {
          requestId: {
            in: selectedDemographics,
          },
        },
      });
    } catch (error) {
      this.logger.log(
        `Ошибка получения случайных демографий: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
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
      const skip = (page - 1) * limit;

      const whereClause = {
        ...shikimoriScoreNotNull,
        demographic: {
          some: {
            demographic: {
              requestId: requestId,
            },
          },
        },
      };

      const [animesFromDemographic, total] = await Promise.all([
        this.prismaService.anime.findMany({
          where: whereClause,
          include: {
            ...includeSmall,
          },
          take: limit,
          skip: skip,
        }),

        this.prismaService.anime.count({
          where: whereClause,
        }),
      ]);

      return {
        data: animesFromDemographic,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.log(
        `Ошибка получения аниме по демографии: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }

  public async getRandomAnimeFromDemographic(requestId: number) {
    try {
      let release: Anime | null = null;

      const allIds = await this.prismaService.anime.findMany({
        where: {
          ...shikimoriScoreNotNull,
          demographic: {
            some: {
              demographic: {
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
        Number(release?.shikimoriId || 0),
      );

      return { ...release, ...episodes };
    } catch (error) {
      this.logger.log(
        `Ошибка получения случайного аниме по демографии: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return [];
    }
  }
}
