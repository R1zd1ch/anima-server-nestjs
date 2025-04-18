import { Injectable } from '@nestjs/common';
import {
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class ThemesService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getThemes() {
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
  }

  public async getThemeById(requestId: number) {
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
  }

  public async getRandomTheme(count: number = 1) {
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
  }

  public async getAnimeFromTheme(
    requestId: number,
    pageFromQuery: number,
    limitFromQuery: number,
  ) {
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
  }
}
