import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { ReleasesParamsDto } from './dtos/releases-params.dto';
import { Prisma } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';
import { EpisodesService } from '../episodes/episodes.service';
import { handleError } from 'shared/lib/utils/handle-error';
import { buildPagination } from 'shared/lib/utils/build-pagination';
import { buildMeta } from 'shared/lib/utils/build-meta';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly episodesService: EpisodesService,
  ) {}

  async getReleases(params: ReleasesParamsDto) {
    try {
      const whereConditions: Prisma.AnimeWhereInput & {
        AND: Prisma.AnimeWhereInput[];
      } = { AND: [...shikimoriScoreNotNull.AND] };
      let orderBy: Prisma.AnimeOrderByWithRelationInput = { createdAt: 'desc' };

      if (params.russian) {
        whereConditions.AND.push({
          russian: {
            contains: params.russian,
            mode: 'insensitive',
          },
        });
      }

      if (params.genres?.length) {
        whereConditions.AND.push({
          genres: { some: { genre: { requestId: { in: params.genres } } } },
        });
      }

      if (params.themes?.length) {
        whereConditions.AND.push({
          theme: { some: { theme: { requestId: { in: params.themes } } } },
        });
      }

      if (params.demographics?.length) {
        whereConditions.AND.push({
          demographic: {
            some: { demographic: { requestId: { in: params.demographics } } },
          },
        });
      }

      if (params.types) {
        whereConditions.AND.push({
          kind: { in: params.types },
        });
      }

      if (params.seasons?.length) {
        whereConditions.AND.push({
          OR: params.seasons.map((s) => ({
            season: { startsWith: `${s}_` },
          })),
        });
      }

      if (params.min_year) {
        whereConditions.AND.push({
          airedOn: {
            gte: new Date(
              `${params.min_year}-01-01T00:00:00.000Z`,
            ).toISOString(),
          },
        });
      }

      if (params.max_year) {
        whereConditions.AND.push({
          airedOn: {
            lte: new Date(
              `${params.max_year}-12-31T23:59:59.999Z`,
            ).toISOString(),
          },
        });
      }

      if (params.sort) {
        const [field, order] = params.sort.split('_');
        if (field && ['asc', 'desc'].includes(order)) {
          orderBy = { [field]: order as Prisma.SortOrder };
        }
      }

      if (params.age_ratings) {
        whereConditions.AND.push({ rating: { in: params.age_ratings } });
      }

      if (params.status) {
        whereConditions.AND.push({ status: params.status });
      }

      const releases = await this.prismaService.anime.findMany({
        where: whereConditions,
        ...buildPagination(params.page, params.limit),
        include: includeSmall,
        orderBy: orderBy,
      });

      this.logger.log(releases.length);
      const total = await this.prismaService.anime.count({
        where: whereConditions,
      });

      return {
        data: releases,
        meta: buildMeta(total, params.page, params.limit),
      };
    } catch (e) {
      handleError(e, 'Ошибка при получении релизов', this.logger);
    }
  }

  async getRelease(id?: string, shikimoriId?: string) {
    try {
      if (id || shikimoriId) {
        const release = await this.prismaService.anime.findFirst({
          where: { id, shikimoriId, ...shikimoriScoreNotNull },
          include: includeAll,
        });

        if (!release) return { data: null };

        const episodes = await this.episodesService.getEpisodes(
          release.alias,
          Number(release.shikimoriId || 0),
        );

        return { ...release, ...episodes };
      }

      return;
    } catch (e) {
      handleError(e, 'Ошибка при получении релиза', this.logger);
    }
  }
}
