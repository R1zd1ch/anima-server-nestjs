import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
      return this.prismaService.review.findMany({
        where: {
          animeId: releaseId,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch {
      this.logger.log(`ошибка получения оценок по id релиза`);
      return [];
    }
  }

  public async createReview(dto: CreateReviewDto) {
    try {
      return this.prismaService.review.create({
        data: dto,
      });
    } catch {
      this.logger.log(`ошибка создания оценки`);
      return null;
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

      if (!review) {
        throw new NotFoundException(`оценка не найдена`);
      }

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
      this.logger.log(`ошибка обновления оценки`);
      return null;
    }
  }

  public async deleteReview(reviewId: string) {
    try {
      const review = await this.prismaService.review.findUnique({
        where: {
          id: reviewId,
        },
      });

      if (!review) {
        throw new NotFoundException(`оценка не найдена`);
      }

      return this.prismaService.review.delete({
        where: {
          id: reviewId,
        },
      });
    } catch {
      this.logger.log(`ошибка удаления оценки`);
    }
  }
}
