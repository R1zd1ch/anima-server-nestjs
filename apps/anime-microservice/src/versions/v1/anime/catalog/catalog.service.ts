import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { ReleasesParamsDto } from './dtos/releases-params.dto';
import { Prisma } from '@prisma/__generated__';
import {
  includeAll,
  includeSmall,
  shikimoriScoreNotNull,
} from 'apps/anime-microservice/src/constants';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  async getReleases(params: ReleasesParamsDto) {
    try {
      const whereConditions: Prisma.AnimeWhereInput & {
        AND: Prisma.AnimeWhereInput[];
      } = {
        AND: [...shikimoriScoreNotNull.AND],
      };
      let orderBy: Prisma.AnimeOrderByWithRelationInput = { createdAt: 'desc' };

      if (params.genres?.length) {
        whereConditions.AND.push({
          genres: {
            some: {
              genre: {
                requestId: { in: params.genres },
              },
            },
          },
        });
      }

      if (params.themes?.length) {
        whereConditions.AND.push({
          theme: {
            some: {
              theme: {
                requestId: { in: params.themes },
              },
            },
          },
        });
      }

      if (params.demographics?.length) {
        whereConditions.AND.push({
          demographic: {
            some: {
              demographic: {
                requestId: { in: params.demographics },
              },
            },
          },
        });
      }

      if (params.types) {
        whereConditions.AND.push({
          kind: {
            in: params.types,
          },
        });
      }

      if (params.season) {
        whereConditions.AND.push({
          season: { startsWith: `${params.season}_` },
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
        console.log(field, order);
        if (field && ['asc', 'desc'].includes(order)) {
          orderBy = { [field]: order as Prisma.SortOrder };
        }
      }

      if (params.age_ratings) {
        whereConditions.AND.push({
          rating: { in: params.age_ratings },
        });
      }

      if (params.status) {
        whereConditions.AND.push({
          status: params.status,
        });
      }

      const releases = await this.prismaService.anime.findMany({
        where: whereConditions,
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        include: {
          ...includeSmall,
        },
        orderBy: {
          ...orderBy,
        },
      });

      this.logger.log(releases.length);

      return releases;
    } catch (e) {
      this.logger.error(
        'Failed to get releases',
        e instanceof Error ? e.stack : e,
      );
      throw e instanceof Error ? e : new Error(String(e));
    }
  }

  async getRelease(id?: string, shikimoriId?: string) {
    if (id || shikimoriId) {
      const release = await this.prismaService.anime.findFirst({
        where: {
          id,
          shikimoriId,
          ...shikimoriScoreNotNull,
        },
        include: {
          ...includeAll,
        },
      });
      return release;
    }

    return [];
  }
}
