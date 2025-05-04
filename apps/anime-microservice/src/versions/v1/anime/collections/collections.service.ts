import { Injectable, Logger } from '@nestjs/common';
import {
  AnimeCollectionLike,
  AnimeCollectionType,
  AnimeKind,
  AnimeRating,
} from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

type MetricResult<T extends string | number> = {
  key: T;
  count: number;
  percentage: number;
};

type CollectionMetricResponse<T extends string | number> = {
  count: number;
  metrics: MetricResult<T>[];
};

interface CollectionWithItems {
  items: {
    anime: {
      rating: AnimeRating;
      kind: AnimeKind;
      airedOn: string;
      genres: { genre: { russian: string } }[];
      theme: { theme: { russian: string } }[];
      demographic: { demographic: { russian: string } }[];
    };
  }[];
}

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getCollectionsBase(userId: string) {
    return this.prisma.animeCollection.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            anime: {
              select: {
                rating: true,
                kind: true,
                airedOn: true,
                genres: { include: { genre: true } },
                theme: { include: { theme: true } },
                demographic: { include: { demographic: true } },
              },
            },
          },
        },
      },
    });
  }

  private handleError<T>(method: string, error: unknown): T {
    this.logger.error(
      `Error in ${method}: ${error instanceof Error ? error.message : 'unknown'}`,
    );
    return [] as T;
  }

  private processMetric<T extends string | number>(
    collections: CollectionWithItems[],
    extractor: (
      anime: CollectionWithItems['items'][number]['anime'],
    ) => T | T[],
  ): CollectionMetricResponse<T> {
    const allItems = collections.flatMap((c) => c.items);
    const count = allItems.length;

    if (count === 0) return { count: 0, metrics: [] };

    const metricsMap = allItems.reduce((acc, { anime }) => {
      const keyOrKeys = extractor(anime);
      const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
      keys.forEach((key) => {
        acc.set(key, (acc.get(key) || 0) + 1);
      });
      return acc;
    }, new Map<T, number>());

    return {
      count,
      metrics: Array.from(metricsMap.entries()).map(([key, cnt]) => ({
        key,
        count: cnt,
        percentage: Number(((cnt / count) * 100).toFixed(2)),
      })),
    };
  }

  async getAgeRatings(
    userId: string,
  ): Promise<CollectionMetricResponse<AnimeRating>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) => anime.rating);
    } catch (error) {
      return this.handleError('getAgeRatings', error);
    }
  }

  async getAnimeTypes(
    userId: string,
  ): Promise<CollectionMetricResponse<AnimeKind>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) => anime.kind);
    } catch (error) {
      return this.handleError('getAnimeTypes', error);
    }
  }

  async getReleaseYears(
    userId: string,
  ): Promise<CollectionMetricResponse<number>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) =>
        new Date(anime.airedOn).getFullYear(),
      );
    } catch (error) {
      return this.handleError('getReleaseYears', error);
    }
  }

  async getGenres(userId: string): Promise<CollectionMetricResponse<string>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) =>
        anime.genres.flatMap((g) => g.genre.russian),
      );
    } catch (error) {
      return this.handleError('getGenres', error);
    }
  }

  async getThemes(userId: string): Promise<CollectionMetricResponse<string>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) =>
        anime.theme.flatMap((t) => t.theme.russian),
      );
    } catch (error) {
      return this.handleError('getThemes', error);
    }
  }

  async getDemographics(
    userId: string,
  ): Promise<CollectionMetricResponse<string>> {
    try {
      const collections = await this.getCollectionsBase(userId);
      return this.processMetric(collections, (anime) =>
        anime.demographic.flatMap((d) => d.demographic.russian),
      );
    } catch (error) {
      return this.handleError('getDemographics', error);
    }
  }

  async getCollections(userId: string) {
    try {
      return this.prisma.animeCollection
        .findMany({
          where: { userId },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                items: true,
                likes: true,
              },
            },
            likes: {
              where: { userId },
              select: { userId: true },
            },
          },
        })
        .then((collections) =>
          collections.map((c) => ({
            ...c,
            isLiked: c.likes.length > 0,
          })),
        );
    } catch (error) {
      return this.handleError('getCollections', error);
    }
  }

  async getCollectionDetails(userId: string, collectionId: string) {
    try {
      return this.prisma.animeCollection
        .findUnique({
          where: { id: collectionId, userId },
          include: {
            items: {
              select: {
                anime: { select: { id: true, name: true, poster: true } },
                note: true,
                addedAt: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
            likes: {
              where: { userId },
              select: { userId: true },
            },
          },
        })
        .then((collection) =>
          collection
            ? {
                ...collection,
                isLiked: collection.likes.length > 0,
              }
            : null,
        );
    } catch (error) {
      return this.handleError('getCollectionDetails', error);
    }
  }

  async createCollection(
    userId: string,
    data: {
      title: string;
      description?: string;
      type?: AnimeCollectionType;
      isPublic?: boolean;
    },
  ) {
    try {
      return this.prisma.animeCollection.create({
        data: {
          userId,
          type: data.type ?? 'CUSTOM',
          isPublic: data.isPublic ?? false,
          ...data,
        },
      });
    } catch (error) {
      return this.handleError('createCollection', error);
    }
  }

  async updateCollection(
    userId: string,
    collectionId: string,
    data: {
      title?: string;
      description?: string;
      type?: AnimeCollectionType;
      isPublic?: boolean;
    },
  ) {
    try {
      return this.prisma.animeCollection.update({
        where: { id: collectionId, userId },
        data,
      });
    } catch (error) {
      return this.handleError('updateCollection', error);
    }
  }

  async deleteCollection(userId: string, collectionId: string) {
    try {
      return this.prisma.animeCollection.delete({
        where: { id: collectionId, userId },
      });
    } catch (error) {
      return this.handleError('deleteCollection', error);
    }
  }

  async addToCollection(collectionId: string, animeId: string, note?: string) {
    try {
      return this.prisma.animeInCollection.upsert({
        where: { collectionId_animeId: { collectionId, animeId } },
        create: { collectionId, animeId, note },
        update: { note },
      });
    } catch (error) {
      return this.handleError('addToCollection', error);
    }
  }

  async removeFromCollection(collectionId: string, animeId: string) {
    try {
      return this.prisma.animeInCollection.delete({
        where: { collectionId_animeId: { collectionId, animeId } },
      });
    } catch (error) {
      return this.handleError('removeFromCollection', error);
    }
  }

  async updateNote(collectionId: string, animeId: string, note: string) {
    try {
      return this.prisma.animeInCollection.update({
        where: { collectionId_animeId: { collectionId, animeId } },
        data: { note },
      });
    } catch (error) {
      return this.handleError('updateNote', error);
    }
  }

  async getFullAnalytics(userId: string) {
    try {
      const [ratings, types, years, genres, themes, demographics] =
        await Promise.all([
          this.getAgeRatings(userId),
          this.getAnimeTypes(userId),
          this.getReleaseYears(userId),
          this.getGenres(userId),
          this.getThemes(userId),
          this.getDemographics(userId),
        ]);

      return {
        ratings,
        types,
        years,
        genres,
        themes,
        demographics,
      };
    } catch (error) {
      return this.handleError('getFullAnalytics', error);
    }
  }

  async likeCollection(userId: string, collectionId: string) {
    try {
      const collection = await this.prisma.animeCollection.findUnique({
        where: { id: collectionId },
        select: { userId: true },
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      if (collection.userId === userId) {
        throw new Error('Cannot like own collection');
      }

      return await this.prisma.animeCollectionLike.upsert({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
        create: {
          userId,
          collectionId,
          likedAt: new Date(),
        },
        update: {},
      });
    } catch (error) {
      return this.handleError('likeCollection', error);
    }
  }

  async unlikeCollection(userId: string, collectionId: string) {
    try {
      return await this.prisma.animeCollectionLike.delete({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
      });
    } catch (error) {
      return this.handleError('unlikeCollection', error);
    }
  }

  async getCollectionLikes(collectionId: string, currentUserId?: string) {
    try {
      await this.checkCollectionAccess(collectionId, currentUserId);
      const [count, userLike]: [number, AnimeCollectionLike | null] =
        await Promise.all([
          this.prisma.animeCollectionLike.count({
            where: { collectionId },
          }),
          currentUserId
            ? this.prisma.animeCollectionLike.findUnique({
                where: {
                  userId_collectionId: {
                    userId: currentUserId,
                    collectionId,
                  },
                },
              })
            : Promise.resolve(null as AnimeCollectionLike | null),
        ]);

      return {
        count,
        isLiked: !!userLike,
        latestLikes: await this.prisma.animeCollectionLike.findMany({
          where: { collectionId },
          take: 10,
          orderBy: { likedAt: 'desc' },
          select: {
            user: {
              select: {
                id: true,
                username: true,
                picture: true,
              },
            },
          },
        }),
      };
    } catch (error) {
      return this.handleError('getCollectionLikes', error);
    }
  }

  async getUserLikedCollections(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    try {
      const skip = (page - 1) * pageSize;

      return await this.prisma.animeCollectionLike.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { likedAt: 'desc' },
        select: {
          collection: {
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  items: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      return this.handleError('getUserLikedCollections', error);
    }
  }

  private async checkCollectionAccess(collectionId: string, userId?: string) {
    const collection = await this.prisma.animeCollection.findUnique({
      where: { id: collectionId },
      select: { isPublic: true, userId: true },
    });

    if (!collection) throw new Error('Collection not found');
    if (!collection.isPublic && collection.userId !== userId) {
      throw new Error('Private collection');
    }

    return true;
  }
}
