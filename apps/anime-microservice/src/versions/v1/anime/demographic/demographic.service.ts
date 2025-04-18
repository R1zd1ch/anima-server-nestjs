import { Injectable, Logger } from '@nestjs/common';
import {
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';

import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class DemographicService {
  private readonly logger = new Logger(DemographicService.name);

  public constructor(private readonly prismaService: PrismaService) {}

  public async getDemographics() {
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
  }

  public async getDemographicById(requestId: number) {
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
  }

  public async getRandomDemographic(count: number = 1) {
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
  }

  public async getAnimeFromDemographic(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
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
  }
}
