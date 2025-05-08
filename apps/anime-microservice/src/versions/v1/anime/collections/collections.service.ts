import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateAnimeNoteDto } from './dto/update-anime-note-in-collection.dto';
import { AddAnimeToCollectionDto } from './dto/add-anime-to-collection.dto';
import { buildMeta } from 'shared/lib/utils/build-meta';
import { handleError } from 'shared/lib/utils/handle-error';

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserCollections(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'top' = 'newest',
    viewerId?: string,
  ) {
    try {
      const isOwner = viewerId && userId === viewerId;
      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { settings: { select: { showCollections: true } } },
        });

        if (!targetUser) throw new NotFoundException('Пользователь не найден');

        if (!targetUser?.settings?.showCollections) {
          return {
            data: [],
            meta: buildMeta(0, page, limit),
          };
        }
      }
      const where = { userId };

      const collections = await this.prismaService.animeCollection.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest'
            ? { createdAt: 'desc' }
            : { likes: { _count: 'desc' } },
        include: {
          _count: {
            select: { likes: true, items: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
        },
      });

      const collectionIds = collections.map((collection) => collection.id);
      const viewerLikesForCollections = viewerId
        ? await this.prismaService.animeCollectionLike.findMany({
            where: {
              userId: viewerId,
              collectionId: { in: collectionIds },
            },
          })
        : [];

      const collectionsWithLikes = collections.map((collection) => {
        const { _count, ...rest } = collection;
        return {
          ...rest,
          isLiked: viewerLikesForCollections.some(
            (like) => like.collectionId === collection.id,
          ),
          likesCount: _count.likes,
          itemsCount: _count.items,
        };
      });

      const total = await this.prismaService.animeCollection.count({ where });

      return {
        data: collectionsWithLikes,
        meta: buildMeta(total, page, limit),
      };
    } catch (e) {
      return handleError(
        e,
        `Ошибка получения коллекции пользователя`,
        this.logger,
      );
    }
  }

  public async getUserLikedCollections(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'top' = 'newest',
    viewerId?: string,
  ) {
    try {
      const isOwner = viewerId && userId === viewerId;
      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { settings: { select: { showLikedCollections: true } } },
        });

        if (!targetUser) throw new NotFoundException('Пользователь не найден');

        if (!targetUser?.settings?.showLikedCollections) {
          return {
            data: [],
            meta: buildMeta(0, page, limit),
          };
        }
      }

      const where = { userId };

      const likedCollections =
        await this.prismaService.animeCollectionLike.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy:
            sortBy === 'newest'
              ? { collection: { createdAt: 'desc' } }
              : { collection: { likes: { _count: 'desc' } } },
          include: {
            collection: {
              include: {
                _count: {
                  select: { likes: true, items: true },
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                    picture: true,
                  },
                },
              },
            },
          },
        });

      const collectionIds = likedCollections.map(
        (collection) => collection.collection.id,
      );
      const viewerLikesForCollections = viewerId
        ? await this.prismaService.animeCollectionLike.findMany({
            where: {
              userId: viewerId,
              collectionId: { in: collectionIds },
            },
          })
        : [];

      const collectionsWithLikes = likedCollections.map((collection) => {
        const { _count, ...rest } = collection.collection;
        return {
          ...rest,
          isLiked: viewerLikesForCollections.some(
            (like) => like.collectionId === collection.collection.id,
          ),
          likesCount: _count.likes,
          itemsCount: _count.items,
        };
      });

      const total = await this.prismaService.animeCollectionLike.count({
        where,
      });

      return {
        data: collectionsWithLikes,
        meta: buildMeta(total, page, limit),
      };
    } catch (e) {
      return handleError(
        e,
        `Ошибка получения лайкнутых коллекций пользователя`,
        this.logger,
      );
    }
  }

  public async getCollections(
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' | 'top' = 'newest',
    viewerId?: string,
  ) {
    try {
      const collections = await this.prismaService.animeCollection.findMany({
        where: { isPublic: true, type: 'CUSTOM' },
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest'
            ? { createdAt: 'desc' }
            : sortBy === 'oldest'
              ? { createdAt: 'asc' }
              : { likes: { _count: 'desc' } },
        include: {
          _count: {
            select: { likes: true, items: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
        },
      });

      if (!collections) throw new NotFoundException('Коллекция не найдена');
      const collectionIds = collections.map((collection) => collection.id);
      const viewerLikesForCollections = viewerId
        ? await this.prismaService.animeCollectionLike.findMany({
            where: {
              userId: viewerId,
              collectionId: { in: collectionIds },
            },
          })
        : [];

      const collectionsWithLikes = collections.map((collection) => {
        const { _count, ...rest } = collection;
        return {
          ...rest,
          isLiked: viewerLikesForCollections.some(
            (like) => like.collectionId === collection.id,
          ),
          likesCount: _count.likes,
          itemsCount: _count.items,
        };
      });
      const total = await this.prismaService.animeCollection.count({
        where: {
          isPublic: true,
        },
      });

      return {
        data: collectionsWithLikes,
        meta: buildMeta(total, page, limit),
      };
    } catch (e) {
      handleError(e, `Ошибка получения всех коллекций`, this.logger);
    }
  }

  public async getCollection(collectionId: string, viewerId?: string) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
        include: {
          items: {
            include: {
              anime: {
                select: {
                  id: true,
                  name: true,
                  russian: true,
                  airedOn: true,
                  rating: true,
                  description: true,
                  kind: true,
                  theme: true,
                  demographic: true,
                  genres: true,
                  poster: {
                    select: {
                      originalUrl: true,
                      mainUrl: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              items: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
        },
      });
      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const isLiked = await this.isCollectionLiked(viewerId, collectionId);

      const { _count, ...rest } = collection;
      return {
        ...rest,
        isLiked,
        itemsCount: _count.items,
        likesCount: _count.likes,
      };
    } catch (e) {
      handleError(e, `Ошибка получения деталей коллекции`, this.logger);
    }
  }

  public async getAgeRatingsFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      });
      if (!collection) throw new NotFoundException('Коллекция не найдена');

      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const ratings = collection.items.map((item) => item.anime.rating);
      const countsMap: Record<string, number> = {};

      for (const rating of ratings) {
        countsMap[rating] = (countsMap[rating] || 0) + 1;
      }

      const ratingCounts = Object.entries(countsMap).map(([rating, count]) => ({
        rating,
        count,
      }));

      return ratingCounts;
    } catch (e) {
      return handleError(
        e,
        `Ошибка получения рейтингов из коллекции`,
        this.logger,
      );
    }
  }

  public async getAnimeTypesFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  kind: true,
                },
              },
            },
          },
        },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');

      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const animeTypes = collection.items.map((item) => item.anime.kind);
      const countsMap: Record<string, number> = {};

      for (const type of animeTypes) {
        countsMap[type] = (countsMap[type] || 0) + 1;
      }
      const typeCounts = Object.entries(countsMap).map(([type, count]) => ({
        type,
        count,
      }));

      return typeCounts;
    } catch (e) {
      handleError(e, 'Ошибка получения типов из коллекции', this.logger);
    }
  }

  public async getThemesFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  theme: {
                    select: {
                      theme: {
                        select: {
                          russian: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const themes = collection.items.flatMap((item) =>
        item.anime.theme.map((theme) => theme.theme.russian),
      );
      const countsMap: Record<string, number> = {};

      for (const theme of themes) {
        countsMap[theme] = (countsMap[theme] || 0) + 1;
      }

      const themeCounts = Object.entries(countsMap).map(([theme, count]) => ({
        theme,
        count,
      }));

      return themeCounts;
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения тематик из коллекции',
        this.logger,
      );
    }
  }

  public async getReleaseYearsFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  airedOn: true,
                },
              },
            },
          },
        },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const years = collection.items.map((item) =>
        new Date(item.anime.airedOn).getFullYear(),
      );

      const countsMap: Record<number, number> = {};

      for (const year of years) {
        countsMap[year] = (countsMap[year] || 0) + 1;
      }

      const yearCounts = Object.entries(countsMap).map(([year, count]) => ({
        year: Number(year),
        count,
      }));

      return yearCounts;
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения годов выпуска из коллекции',
        this.logger,
      );
    }
  }

  public async getGenresFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  genres: {
                    select: {
                      genre: {
                        select: {
                          russian: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const genres = collection.items.flatMap((item) =>
        item.anime.genres.map((genre) => genre.genre.russian),
      );
      const countsMap: Record<string, number> = {};

      for (const genre of genres) {
        countsMap[genre] = (countsMap[genre] || 0) + 1;
      }
      const genreCounts = Object.entries(countsMap).map(([genre, count]) => ({
        genre,
        count,
      }));

      return genreCounts;
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения жанров из коллекции',
        this.logger,
      );
    }
  }

  public async getDemographicsFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
        select: {
          isPublic: true,
          userId: true,
          items: {
            select: {
              anime: {
                select: {
                  demographic: {
                    select: {
                      demographic: {
                        select: {
                          russian: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const demographics = collection.items.flatMap((item) =>
        item.anime.demographic.map(
          (demographic) => demographic.demographic.russian,
        ),
      );

      const countsMap: Record<string, number> = {};

      for (const demographic of demographics) {
        countsMap[demographic] = (countsMap[demographic] || 0) + 1;
      }

      const demographicCounts = Object.entries(countsMap).map(
        ([demographic, count]) => ({
          demographic,
          count,
        }),
      );

      return demographicCounts;
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения демографических категорий из коллекции',
        this.logger,
      );
    }
  }

  public async getAllMetricsFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
        select: { isPublic: true, userId: true },
      });
      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!collection.isPublic && collection.userId !== viewerId) {
        throw new UnauthorizedException('Коллекция приватная');
      }

      const [
        ageRatings,
        animeTypes,
        releaseYears,
        genres,
        themes,
        demographics,
        isLiked,
      ] = await Promise.all([
        this.getAgeRatingsFromCollection(collectionId, viewerId),
        this.getAnimeTypesFromCollection(collectionId, viewerId),
        this.getReleaseYearsFromCollection(collectionId, viewerId),
        this.getGenresFromCollection(collectionId, viewerId),
        this.getThemesFromCollection(collectionId, viewerId),
        this.getDemographicsFromCollection(collectionId, viewerId),
        this.isCollectionLiked(viewerId, collectionId),
      ]);

      return {
        ageRatings,
        animeTypes,
        releaseYears,
        genres,
        themes,
        demographics,
        isLiked,
      };
    } catch (e) {
      return handleError(
        e,
        'Ошибка получения всех метрик из коллекции',
        this.logger,
      );
    }
  }

  public async createCollection(userId: string, dto: CreateCollectionDto) {
    try {
      const collection = await this.prismaService.animeCollection.create({
        data: { ...dto, userId },
      });

      return this.getCollection(collection.id, userId);
    } catch (e) {
      handleError(e, `Ошибка создания коллекции`, this.logger);
    }
  }

  public async updateCollection(
    userId: string,
    collectionId: string,
    dto: UpdateCollectionDto,
  ) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (collection.userId !== userId) {
        throw new UnauthorizedException('Недостаточно прав');
      }

      await this.prismaService.animeCollection.update({
        where: { userId, id: collectionId },
        data: dto,
      });

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка обновления коллекции`, this.logger);
    }
  }

  public async deleteCollection(userId: string, collectionId: string) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (collection.userId !== userId) {
        throw new UnauthorizedException('Недостаточно прав');
      }

      await this.prismaService.animeCollection.delete({
        where: { userId, id: collectionId },
      });

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка удаления коллекции`, this.logger);
    }
  }

  public async addAnimeToCollection(
    userId: string,
    collectionId: string,
    dto: AddAnimeToCollectionDto,
  ) {
    try {
      const [anime, collection] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: dto.animeId },
        }),
        this.prismaService.animeCollection.findUnique({
          where: { userId, id: collectionId },
        }),
      ]);

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (userId !== collection.userId)
        throw new UnauthorizedException('Недостаточно прав');
      if (!anime) throw new NotFoundException('Аниме не найдено');

      await this.prismaService.animeInCollection.upsert({
        where: { collectionId_animeId: { collectionId, animeId: dto.animeId } },
        create: { collectionId, animeId: dto.animeId, note: dto.note },
        update: {},
      });

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка добавления аниме в коллекцию`, this.logger);
    }
  }

  public async removeAnimeFromCollection(
    userId: string,
    collectionId: string,
    animeId: string,
  ) {
    try {
      const [anime, collection] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: animeId },
        }),
        this.prismaService.animeCollection.findUnique({
          where: { userId, id: collectionId },
        }),
      ]);

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!anime) throw new NotFoundException('Аниме не найдено');
      if (userId !== collection.userId)
        throw new UnauthorizedException('Недостаточно прав');

      const IsAnimeInCollection =
        await this.prismaService.animeInCollection.findUnique({
          where: { collectionId_animeId: { collectionId, animeId } },
        });

      if (!IsAnimeInCollection)
        throw new NotFoundException('Аниме не найдено в коллекции');

      await this.prismaService.animeInCollection.delete({
        where: { collectionId_animeId: { collectionId, animeId } },
      });

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка удаления аниме из коллекции`, this.logger);
    }
  }

  public async updateAnimeNoteInCollection(
    userId: string,
    collectionId: string,
    dto: UpdateAnimeNoteDto,
  ) {
    try {
      const [anime, collection] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: dto.animeId },
        }),
        this.prismaService.animeCollection.findUnique({
          where: { userId, id: collectionId },
        }),
      ]);
      if (!collection) throw new NotFoundException('Коллекция не найдена');
      if (!anime) throw new NotFoundException('Аниме не найдено');
      if (userId !== collection.userId)
        throw new UnauthorizedException('Недостаточно прав');

      const IsAnimeInCollection =
        await this.prismaService.animeInCollection.findUnique({
          where: {
            collectionId_animeId: { collectionId, animeId: dto.animeId },
          },
        });

      if (!IsAnimeInCollection)
        throw new NotFoundException('Аниме не найдено в коллекции');

      await this.prismaService.animeInCollection.update({
        where: { collectionId_animeId: { collectionId, animeId: dto.animeId } },
        data: { note: dto.note },
      });

      return { status: 'success' };
    } catch (e) {
      return handleError(
        e,
        `Ошибка обновления заметки в коллекции`,
        this.logger,
      );
    }
  }

  public async likeCollection(userId: string, collectionId: string) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      this.checkCollectionAccess(collection, userId);

      const isLiked = await this.isCollectionLiked(userId, collectionId);

      if (!isLiked) {
        await this.prismaService.animeCollectionLike.create({
          data: { userId, collectionId },
        });
      }

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка лайка коллекции`, this.logger);
    }
  }

  public async unlikeCollection(userId: string, collectionId: string) {
    try {
      const collection = await this.prismaService.animeCollection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      this.checkCollectionAccess(collection, userId);
      const isLiked = await this.isCollectionLiked(userId, collectionId);

      if (isLiked) {
        await this.prismaService.animeCollectionLike.delete({
          where: { userId_collectionId: { userId, collectionId } },
        });
      }

      return { status: 'success' };
    } catch (e) {
      handleError(e, `Ошибка лайка коллекции`, this.logger);
    }
  }

  private async isCollectionLiked(
    userId: string | undefined,
    collectionId: string,
  ) {
    try {
      if (!userId) return false;
      const like = await this.prismaService.animeCollectionLike.findUnique({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
      });

      return like ? true : false;
    } catch (e) {
      handleError(e, `Ошибка проверки лайка коллекции`, this.logger);
    }
  }

  private checkCollectionAccess(
    collection: { isPublic: boolean; userId: string },
    viewerId?: string,
  ) {
    if (!collection.isPublic && collection.userId !== viewerId) {
      throw new UnauthorizedException('Коллекция приватная');
    }
  }
}
