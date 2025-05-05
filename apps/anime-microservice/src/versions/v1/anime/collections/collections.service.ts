import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateAnimeNoteDto } from './dto/update-anime-note-in-collection.dto';
import { AddAnimeToCollectionDto } from './dto/add-anime-to-collection.dto';

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
            meta: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
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

      const collectionsWithLikes = collections.map((collection) => ({
        ...collection,
        isLiked: viewerLikesForCollections.some(
          (like) => like.collectionId === collection.id,
        ),
        likesCount: collection._count.likes,
        itemsCount: collection._count.items,
      }));

      const total = await this.prismaService.animeCollection.count({ where });

      return {
        data: collectionsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      this.handleError(e, `Ошибка получения коллекции пользователя`);
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
            meta: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
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

      const collectionsWithLikes = likedCollections.map((collection) => ({
        ...collection,
        isLiked: viewerLikesForCollections.some(
          (like) => like.collectionId === collection.collection.id,
        ),
        likesCount: collection.collection._count.likes,
        itemsCount: collection.collection._count.items,
      }));

      const total = await this.prismaService.animeCollectionLike.count({
        where,
      });

      return {
        data: collectionsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      this.handleError(e, `Ошибка получения лайкнутых коллекций пользователя`);
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

      const collectionsWithLikes = collections.map((collection) => ({
        ...collection,
        isLiked: viewerLikesForCollections.some(
          (like) => like.collectionId === collection.id,
        ),
        likesCount: collection._count.likes,
        itemsCount: collection._count.items,
      }));
      const total = await this.prismaService.animeCollection.count({
        where: {
          isPublic: true,
        },
      });

      return {
        data: collectionsWithLikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      this.handleError(e, `Ошибка получения всех коллекций`);
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

      return {
        ...collection,
        isLiked,
        itemsCount: collection._count.items,
        likesCount: collection._count.likes,
      };
    } catch (e) {
      this.handleError(e, `Ошибка получения деталей коллекции`);
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
      this.handleError(e, `Ошибка получения рейтингов из коллекции`);
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
      this.handleError(e, 'Ошибка получения типов из коллекции');
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
      this.handleError(e, 'Ошибка получения тематик из коллекции');
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
      this.handleError(e, 'Ошибка получения годов выпуска из коллекции');
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
      this.handleError(e, 'Ошибка получения жанров из коллекции');
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
      this.handleError(
        e,
        'Ошибка получения демографических категорий из коллекции',
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
      this.handleError(e, 'Ошибка получения всех метрик из коллекции');
    }
  }

  public async createCollection(userId: string, dto: CreateCollectionDto) {
    try {
      const collection = await this.prismaService.animeCollection.create({
        data: { ...dto, userId },
      });

      return this.getCollection(collection.id, userId);
    } catch (e) {
      this.handleError(e, `Ошибка создания коллекции`);
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
      this.handleError(e, `Ошибка обновления коллекции`);
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
      this.handleError(e, `Ошибка удаления коллекции`);
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
      this.handleError(e, `Ошибка добавления аниме в коллекцию`);
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
      this.handleError(e, `Ошибка удаления аниме из коллекции`);
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
      this.handleError(e, `Ошибка обновления заметки в коллекции`);
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
      this.handleError(e, `Ошибка лайка коллекции`);
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
      this.handleError(e, `Ошибка лайка коллекции`);
    }
  }

  private async isCollectionLiked(
    userId: string | undefined,
    collectionId: string,
  ) {
    try {
      console.log(userId);
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
      this.handleError(e, 'Ошибка проверки лайка коллекции');
    }
  }

  private handleError(e: unknown, message: string): never {
    this.logger.error(
      `${message}: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
    );
    if (e instanceof NotFoundException || e instanceof UnauthorizedException)
      throw e;
    throw new InternalServerErrorException(message);
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
