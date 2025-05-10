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
import { buildPagination } from 'shared/lib/utils/build-pagination';
import {
  COLLECTION_COMMON_USER_INCLUDE,
  COMMON_COLLECTION_INCLUDE,
} from 'apps/anime-microservice/src/constants';
import { Prisma } from '@prisma/__generated__';

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
      const access = await this.checkUserAccess(userId, viewerId);
      if (access?.data) return access;
      const where = { userId };
      const collections = await this.prismaService.animeCollection.findMany({
        where,
        ...buildPagination(page, limit),
        orderBy: this.getSortOrder(sortBy),
        include: {
          _count: { select: { likes: true, items: true } },
          user: { select: COLLECTION_COMMON_USER_INCLUDE },
        },
      });

      const collectionsWithLikes = await this.processCollectionLikes(
        collections,
        viewerId,
      );

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
      const access = await this.checkUserAccess(userId, viewerId);
      if (access?.data) return access;
      const where = { userId };

      const likedCollections =
        await this.prismaService.animeCollectionLike.findMany({
          where,
          ...buildPagination(page, limit),
          orderBy: { collection: this.getSortOrder(sortBy) },
          include: {
            collection: {
              include: {
                _count: { select: { likes: true, items: true } },
                user: { select: COLLECTION_COMMON_USER_INCLUDE },
              },
            },
          },
        });

      const collectionsWithLikes = await this.processCollectionLikes(
        likedCollections.map((collection) => collection.collection),
        viewerId,
      );

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
        ...buildPagination(page, limit),
        orderBy: this.getSortOrder(sortBy),
        include: {
          _count: { select: { likes: true, items: true } },
          user: {
            select: COLLECTION_COMMON_USER_INCLUDE,
          },
        },
      });

      const collectionsWithLikes = await this.processCollectionLikes(
        collections,
        viewerId,
      );

      const total = await this.prismaService.animeCollection.count({
        where: { isPublic: true },
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
        include: COMMON_COLLECTION_INCLUDE,
      });

      if (!collection) throw new NotFoundException('Коллекция не найдена');
      this.checkCollectionAccess(collection, viewerId);
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
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        { rating: true },
      );

      const ratings = collection.items.map((item) => item.anime.rating);
      return this.countItems(ratings);
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
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        { kind: true },
      );

      const types = collection.items.map((item) => item.anime.kind);
      return this.countItems(types);
    } catch (e) {
      handleError(e, 'Ошибка получения типов из коллекции', this.logger);
    }
  }

  public async getThemesFromCollection(
    collectionId: string,
    viewerId?: string,
  ) {
    try {
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        { theme: { select: { theme: { select: { russian: true } } } } },
      );

      const themes = collection.items.flatMap((item) =>
        item.anime.theme.map((theme) => theme.theme.russian),
      );
      return this.countItems(themes);
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
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        { airedOn: true },
      );

      const years = collection.items.map((item) =>
        new Date(item.anime.airedOn).getFullYear(),
      );

      return this.countItems(years);
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
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        {
          genres: { select: { genre: { select: { russian: true } } } },
        },
      );

      const genres = collection.items.flatMap((item) =>
        item.anime.genres.map((genre) => genre.genre.russian),
      );
      return this.countItems(genres);
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
      const collection = await this.getCollectionMetric(
        collectionId,
        viewerId,
        {
          demographic: {
            select: { demographic: { select: { russian: true } } },
          },
        },
      );

      const demographics = collection.items.flatMap((item) =>
        item.anime.demographic.map(
          (demographic) => demographic.demographic.russian,
        ),
      );

      return this.countItems(demographics);
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
      this.checkCollectionAccess(collection, viewerId);

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

      return { message: 'Коллекция успешно обновлена' };
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

      return { message: 'Коллекция успешно удалена' };
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

      return anime;
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

      return {
        message: 'Аниме успешно удалено из коллекции',
      };
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

      return { message: 'Заметка успешно обновлена' };
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

      return { message: 'Лайк успешно поставлен' };
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

      return { message: 'Лайк успешно убран' };
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

  private getSortOrder(order: 'newest' | 'oldest' | 'top') {
    switch (order) {
      case 'newest':
        return { createdAt: 'desc' as const };
      case 'oldest':
        return { createdAt: 'asc' as const };
      case 'top':
        return { likes: { _count: 'desc' as const } };
      default:
        return { createdAt: 'desc' as const };
    }
  }

  private async checkUserAccess(userId: string, viewerId?: string) {
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
          meta: buildMeta(0),
        };
      }
    }
  }

  private async getUserLikes(collectionIds: string[], viewerId: string) {
    return await this.prismaService.animeCollectionLike.findMany({
      where: { userId: viewerId, collectionId: { in: collectionIds } },
    });
  }

  private async processCollectionLikes<
    T extends { id: string; _count?: { likes: number; items: number } },
  >(collections: T[], viewerId: string | null) {
    const collectionIds = collections.map((collection) => collection.id);

    const likes = viewerId
      ? await this.getUserLikes(collectionIds, viewerId)
      : [];

    return collections.map((collection) => {
      const { _count, ...rest } = collection;
      return {
        ...rest,
        isLiked: likes.some((like) => like.collectionId === collection.id),
        itemsCount: _count?.likes ?? 0,
        likesCount: _count?.items ?? 0,
      };
    });
  }

  private countItems<T extends string | number>(items: T[]) {
    const countsMap: Record<string, number> = {};

    for (const item of items) {
      countsMap[String(item)] = (countsMap[String(item)] || 0) + 1;
    }

    return Object.entries(countsMap).map(([key, count]) => ({
      [typeof items[0] === 'number' ? 'year' : key]:
        typeof items[0] === 'number' ? Number(key) : (key as T),
      count,
    }));
  }

  private async getCollectionMetric<T extends Prisma.AnimeSelect>(
    collectionId: string,
    viewerId: string | undefined,
    metric: T,
  ) {
    const collection = await this.prismaService.animeCollection.findUnique({
      where: { id: collectionId },
      select: {
        isPublic: true,
        userId: true,
        items: { select: { anime: { select: metric } } },
      },
    });

    if (!collection) throw new NotFoundException('Коллекция не найдена');
    this.checkCollectionAccess(collection, viewerId);

    return collection;
  }
}
