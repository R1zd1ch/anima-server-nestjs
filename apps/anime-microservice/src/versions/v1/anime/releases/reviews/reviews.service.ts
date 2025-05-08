import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { handleError } from 'shared/lib/utils/handle-error';
import { buildMeta } from 'shared/lib/utils/build-meta';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  private readonly whereTextNotNull = {
    AND: [
      {
        content: {
          not: {
            equals: null,
          },
        },
      },
      {
        title: {
          not: {
            equals: null,
          },
        },
      },
    ],
  };

  public async getReviewsByReleaseId(
    releaseId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' | 'top' = 'newest',
    viewerId?: string | null,
  ) {
    try {
      const where = { animeId: releaseId, ...this.whereTextNotNull };
      const anime = await this.prismaService.anime.findUnique({
        where: { id: releaseId },
      });
      if (!anime) throw new NotFoundException('Аниме не найдено');
      const reviews = await this.prismaService.review.findMany({
        where,
        include: {
          _count: {
            select: { reviewLikes: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy:
          sortBy === 'newest'
            ? { createdAt: 'desc' }
            : sortBy === 'oldest'
              ? { createdAt: 'asc' }
              : { reviewLikes: { _count: 'desc' } },
      });

      if (!reviews) throw new NotFoundException('Оценки не найдены');
      const reviewIds = reviews.map((review) => review.id);
      const viewerLikesForReviews = viewerId
        ? await this.prismaService.reviewLike.findMany({
            where: {
              userId: viewerId,
              reviewId: { in: reviewIds },
            },
          })
        : [];
      const reviewsWithLikes = reviews.map((review) => {
        const { _count, ...rest } = review;
        return {
          ...rest,
          isLiked: viewerLikesForReviews.some(
            (like) => like.reviewId === review.id,
          ),
          likesCount: _count.reviewLikes,
        };
      });
      const total = await this.prismaService.review.count({ where });

      return {
        data: reviewsWithLikes,
        meta: buildMeta(total, page, limit),
      };
    } catch (e) {
      handleError(e, `Ошибка получения оценок`, this.logger);
    }
  }

  public async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' | 'top' = 'newest',
    viewerId?: string | null,
  ) {
    try {
      const isOwner = viewerId && userId === viewerId;
      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { settings: { select: { showReviews: true } } },
        });

        if (!targetUser) throw new NotFoundException('Пользователь не найден');

        if (!targetUser?.settings?.showReviews) {
          return {
            data: [],
            meta: buildMeta(0, page, limit),
          };
        }
      }
      const where = { userId, ...this.whereTextNotNull };
      const reviews = await this.prismaService.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest'
            ? { createdAt: 'desc' }
            : sortBy === 'oldest'
              ? { createdAt: 'asc' }
              : { reviewLikes: { _count: 'desc' } },
        include: {
          _count: {
            select: { reviewLikes: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          anime: {
            select: {
              id: true,
              russian: true,
              name: true,
              poster: {
                select: { originalUrl: true, mainUrl: true },
              },
            },
          },
        },
      });

      const collectionIds = reviews.map((review) => review.id);
      const viewerLikesForReviews = viewerId
        ? await this.prismaService.reviewLike.findMany({
            where: {
              userId: viewerId,
              reviewId: { in: collectionIds },
            },
          })
        : [];

      const total = await this.prismaService.review.count({ where });
      const reviewsWithLikes = reviews.map((review) => {
        const { _count, ...rest } = review;
        return {
          ...rest,
          isLiked: viewerLikesForReviews.some(
            (like) => like.reviewId === review.id,
          ),
          likesCount: _count.reviewLikes,
        };
      });

      return {
        data: reviewsWithLikes,
        meta: buildMeta(total, page, limit),
      };
    } catch (e) {
      return handleError(
        e,
        `Ошибка получения оценок пользователя`,
        this.logger,
      );
    }
  }

  public async getReview(reviewId: string, viewerId?: string | null) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: { id: reviewId },
        include: {
          _count: {
            select: { reviewLikes: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          anime: {
            select: {
              id: true,
              russian: true,
              name: true,
              poster: {
                select: { originalUrl: true, mainUrl: true },
              },
            },
          },
        },
      });

      if (!review) throw new NotFoundException('Оценка не найдена');

      const isLiked = await this.isReviewLiked(viewerId, reviewId);

      const { _count, ...rest } = review;
      return {
        ...rest,
        isLiked,
        likesCount: _count.reviewLikes,
      };
    } catch (e) {
      handleError(e, `Ошибка получения оценки`, this.logger);
    }
  }

  public async getRating(animeId: string) {
    try {
      const anime = await this.prismaService.anime.findUnique({
        where: { id: animeId },
      });
      if (!anime) throw new NotFoundException('Аниме не найдено');

      const rating = await this.prismaService.review.aggregate({
        where: { animeId },
        _avg: {
          rating: true,
        },
      });

      if (!rating) throw new NotFoundException('Рейтинг не найден');

      return {
        rating: rating._avg.rating,
      };
    } catch (e) {
      handleError(e, `Ошибка получения рейтинга`, this.logger);
    }
  }

  public async getUserRatings(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' = 'newest',
    viewerId: string | null,
  ) {
    try {
      const isOwner = viewerId && userId === viewerId;

      if (!isOwner) {
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { settings: { select: { showReviews: true } } },
        });

        if (!targetUser) throw new NotFoundException('Пользователь не найден');

        if (!targetUser?.settings?.showReviews) {
          return {
            data: [],
            meta: buildMeta(0, page, limit),
          };
        }
      }

      const where = { userId };
      const ratings = await this.prismaService.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:
          sortBy === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' },
        include: {
          anime: {
            select: {
              id: true,
              russian: true,
              name: true,
              poster: {
                select: { originalUrl: true, mainUrl: true },
              },
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

      const proccessedRatings = ratings.map((rating) => {
        const { anime, user, ...rest } = rating;
        return {
          id: rest.id,
          rating: rest.rating,
          createdAt: rest.createdAt,
          updatedAt: rest.updatedAt,
          anime,
          user,
        };
      });

      const avgRating = await this.prismaService.review.aggregate({
        where,
        _avg: {
          rating: true,
        },
      });

      return {
        data: {
          ...proccessedRatings,
          avgRating: avgRating._avg.rating,
        },
        meta: buildMeta(ratings.length, page, limit),
      };
    } catch (e) {
      return handleError(
        e,
        `Ошибка получения оценок пользователя`,
        this.logger,
      );
    }
  }

  public async createReview(
    userId: string,
    animeId: string,
    dto: CreateReviewDto,
  ) {
    try {
      const [anime, review] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: animeId },
        }),
        this.prismaService.review.findUnique({
          where: {
            userId_animeId: {
              userId,
              animeId,
            },
          },
        }),
      ]);
      if (!anime) throw new NotFoundException('Аниме не найдено');
      if (review) {
        throw new BadRequestException('Вы уже оставили оценку для этого аниме');
      }

      return this.prismaService.review.create({
        data: { ...dto, userId, animeId },
      });
    } catch (e) {
      handleError(e, `Ошибка создания оценки`, this.logger);
    }
  }

  public async createEmptyReview(
    userId: string,
    animeId: string,
    rating: number,
  ) {
    try {
      const [anime, review] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: animeId },
        }),
        this.prismaService.review.findUnique({
          where: {
            userId_animeId: {
              userId,
              animeId,
            },
          },
        }),
      ]);
      if (!anime) throw new NotFoundException('Аниме не найдено');
      if (review) {
        throw new BadRequestException('Вы уже оставили оценку для этого аниме');
      }
      return this.prismaService.review.create({
        data: { userId, animeId, rating },
      });
    } catch (e) {
      handleError(e, `Ошибка создания оценки`, this.logger);
    }
  }

  public async updateReview(
    userId: string,
    animeId: string,
    dto: UpdateReviewDto,
  ) {
    try {
      const [anime, review] = await this.prismaService.$transaction([
        this.prismaService.anime.findUnique({
          where: { id: animeId },
        }),
        this.prismaService.review.findUnique({
          where: { userId_animeId: { userId, animeId } },
        }),
      ]);

      if (!anime) throw new NotFoundException(`Аниме не найдено`);
      if (!review) throw new NotFoundException(`Оценка не найдена`);

      return this.prismaService.review.update({
        where: { userId_animeId: { userId, animeId } },
        data: dto,
      });
    } catch (e) {
      handleError(e, 'Ошибка обновления оценка', this.logger);
    }
  }

  public async deleteReview(userId: string, animeId: string) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: {
          userId_animeId: {
            userId,
            animeId,
          },
        },
      });

      if (!review) throw new NotFoundException('Оценка не найдена');
      if (review.userId !== userId) throw new UnauthorizedException('Нет прав');

      await this.prismaService.review.delete({
        where: { userId_animeId: { userId, animeId } },
      });
      return { message: 'Оценка удалена' };
    } catch (e) {
      handleError(e, 'Ошибка удаления оценки', this.logger);
    }
  }

  public async likeReview(userId: string, reviewId: string) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: { id: reviewId, userId },
      });

      if (!review) throw new NotFoundException('Оценка не найдена');

      //todo дописать проверку приватная или нет
      const isLiked = await this.isReviewLiked(userId, reviewId);
      if (!isLiked) {
        await this.prismaService.reviewLike.create({
          data: {
            userId,
            reviewId,
          },
        });
      }

      return { message: 'Оценка лайкнута' };
    } catch (e) {
      handleError(e, `Ошибка лайка оценки`, this.logger);
    }
  }

  public async unlikeReview(userId: string, reviewId: string) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: { id: reviewId, userId },
      });

      if (!review) throw new NotFoundException('Оценка не найдена');

      const isLiked = await this.isReviewLiked(userId, reviewId);
      if (isLiked) {
        await this.prismaService.reviewLike.delete({
          where: {
            userId_reviewId: {
              userId,
              reviewId,
            },
          },
        });
      }

      return { message: 'Оценка дизлайкнута' };
    } catch (e) {
      handleError(e, `Ошибка лайка оценки`, this.logger);
    }
  }

  private async isReviewLiked(userId: string | undefined, reviewId: string) {
    try {
      if (!userId) return false;
      const like = await this.prismaService.reviewLike.findUnique({
        where: {
          userId_reviewId: {
            userId,
            reviewId,
          },
        },
      });

      return like ? true : false;
    } catch (e) {
      handleError(e, `Ошибка проверки лайка оценки`, this.logger);
    }
  }
}
