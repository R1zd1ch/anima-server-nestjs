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

@Injectable()
export class ReleasesService {
  private readonly logger = new Logger(ReleasesService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
  ) {}

  public async getLatestReleases(count: number = 10): Promise<Anime[]> {
    try {
      const maxCount = Math.min(Math.max(count, 1), 50);

      const releases = await this.prismaService.anime.findMany({
        where: {
          airedOn: { not: null },
          episodes: { gt: 0 },
          ...shikimoriScoreNotNull,
          nextEpisodeAt: { not: null },
        },
        include: includeSmall,
        orderBy: { airedOn: 'desc', nextEpisodeAt: 'desc' },
        take: maxCount,
      });

      return releases;
    } catch (e) {
      handleError(e, 'Ошибка получения последних релизов', this.logger);
    }
  }

  public async getRandomRelease(withEpisoded: boolean = false): Promise<Anime> {
    try {
      let release: Anime | null = null;
      const allIds = await this.prismaService.anime.findMany({
        select: { shikimoriId: true },
        where: shikimoriScoreNotNull,
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

      if (withEpisoded) {
        const episodes = await this.episodesService.getEpisodes(
          release?.alias,
          Number(release?.shikimoriId || 0),
        );

        return { ...release, ...episodes };
      }

      return release;
    } catch (e) {
      handleError(e, 'Ошибка получения рандомного релиза', this.logger);
    }
  }

  public async getRandomReleases(count: number = 2): Promise<Anime[]> {
    try {
      const maxReleases = Math.min(Math.max(count, 1), 20);

      const releases: Anime[] = [];

      for (let i = 0; i < maxReleases; i++) {
        releases.push(await this.getRandomRelease());
      }

      return releases;
    } catch (e) {
      handleError(e, 'Ошибка получения рандомных релизов', this.logger);
    }
  }

  public async getByAliasOrShikiId(
    alias?: string,
    shikimoriId?: number,
  ): Promise<Anime | null | (Anime & { episodes: any[] })> {
    try {
      if (alias) {
        const anime = await this.prismaService.anime.findFirst({
          where: {
            ...shikimoriScoreNotNull,
            alias: { contains: alias, mode: 'insensitive' },
          },
          include: includeAll,
        });

        if (!anime) return null;

        const shikiId = Number(anime.shikimoriId || 0);
        const episodes = await this.episodesService.getEpisodes(alias, shikiId);
        return { ...anime, ...episodes };
      }

      if (shikimoriId) {
        const anime = await this.prismaService.anime.findUnique({
          where: {
            ...shikimoriScoreNotNull,
            shikimoriId: shikimoriId.toString(),
          },
          include: includeAll,
        });

        if (!anime) return null;

        const episodes = await this.episodesService.getEpisodes(
          anime.alias,
          shikimoriId,
        );

        return { ...anime, ...episodes };
      }

      return null;
    } catch (e) {
      handleError(
        e,
        'Ошибка получения релиза по алиасу или Shikimori ID',
        this.logger,
      );
    }
  }
}
