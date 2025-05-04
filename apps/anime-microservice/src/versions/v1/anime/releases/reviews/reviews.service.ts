import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  public async getReviewsByReleaseId(
    releaseId: string,
    limit: number = 10,
    page: number = 1,
  ) {
    try {
      const where = { animeId: releaseId };
      const [reviews, total] = await Promise.all([
        this.prismaService.review.findMany({
          where,
          include: {
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
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.review.count({ where }),
      ]);

      return {
        data: reviews,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      this.logger.log(`Ошибка получения оценок по id релиза`);
      throw new InternalServerErrorException(
        `Ошибка получения оценок по id релиза`,
      );
    }
  }

  public async createReview(dto: CreateReviewDto) {
    try {
      return this.prismaService.review.create({ data: dto });
    } catch {
      this.logger.log(`Ошибка создания оценки`);
      throw new InternalServerErrorException(`Ошибка создания оценки`);
    }
  }

  public async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'newest' | 'oldest' = 'newest',
  ) {
    try {
      const where = { userId };

      const [comments, total] = await Promise.all([
        this.prismaService.comment.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: sortBy === 'newest' ? 'desc' : 'asc',
          },
          include: {
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
        }),
        this.prismaService.comment.count({ where }),
      ]);

      if (!comments) {
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

      return {
        data: comments,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      this.logger.log(`Ошибка получения оценок пользователя`);
      throw new InternalServerErrorException(
        'Ошибка получения оценок пользователя',
      );
    }
  }

  public async updateReview(dto: UpdateReviewDto) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: {
          userId_animeId: {
            userId: dto.userId,
            animeId: dto.animeId,
          },
        },
      });

      if (!review) throw new NotFoundException(`Оценка не найдена`);
      if (dto.userId !== review.userId)
        throw new UnauthorizedException(`Нельзя обновить чужую оценку`);

      return this.prismaService.review.update({
        where: {
          userId_animeId: {
            userId: dto.userId,
            animeId: dto.animeId,
          },
        },
        data: dto,
      });
    } catch {
      this.logger.log(`Ошибка обновления оценки`);
      throw new InternalServerErrorException(`Ошибка обновления оценки`);
    }
  }

  public async deleteReview(userId: string, reviewId: string) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: {
          id: reviewId,
        },
      });

      if (!review) throw new NotFoundException(`Оценка не найдена`);

      if (userId !== review.userId)
        throw new UnauthorizedException(`Нельзя удалить чужую оценку`);

      return this.prismaService.review.delete({
        where: {
          id: reviewId,
        },
      });
    } catch {
      this.logger.log(`Ошибка удаления оценки`);
      throw new InternalServerErrorException(`Ошибка удаления оценки`);
    }
  }
}
