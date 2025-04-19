import { Injectable, Logger } from '@nestjs/common';
import { Anime } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class ReleasesService {
  private readonly logger = new Logger(ReleasesService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async getLatestReleases(count: number = 10): Promise<Anime[]> {
    const maxCount = Math.min(Math.max(count, 1), 50);

    const releases = await this.prismaService.anime.findMany({
      where: {
        airedOn: { not: null },
        episodes: { gt: 0 },
        ...shikimoriScoreNotNull,
      },
      include: {
        ...includeSmall,
      },
      orderBy: {
        airedOn: 'desc', // сортировка по дате выхода
      },
      take: maxCount,
    });

    return releases;
  }

  public async getRandomRelease(): Promise<Anime> {
    let release: Anime | null = null;
    const allIds = await this.prismaService.anime.findMany({
      select: { shikimoriId: true },
      where: {
        ...shikimoriScoreNotNull,
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

    return release;
  }

  public async getRandomReleases(count: number = 2): Promise<Anime[]> {
    const maxReleases = Math.min(Math.max(count, 1), 20);

    const releases: Anime[] = [];

    for (let i = 0; i < maxReleases; i++) {
      releases.push(await this.getRandomRelease());
    }

    return releases;
  }

  public async getByAliasOrShikiId(
    alias?: string,
    shikimoriId?: number,
  ): Promise<Anime | []> {
    if (alias) {
      return this.prismaService.anime.findFirst({
        where: {
          ...shikimoriScoreNotNull,
          alias: {
            contains: alias,
            mode: 'insensitive',
          },
        },

        include: {
          ...includeAll,
        },
      });
    }

    if (shikimoriId) {
      return this.prismaService.anime.findUnique({
        where: {
          ...shikimoriScoreNotNull,
          shikimoriId: shikimoriId.toString(),
        },

        include: {
          ...includeAll,
        },
      });
    }

    return [];
  }
}
