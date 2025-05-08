import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SoftAuthorization } from 'apps/anime-microservice/src/decorators/soft-auth.decorator';
import { Authorized } from 'apps/anime-microservice/src/decorators/authorized.decorator';
import { parsePagination } from 'shared/lib/utils/parse-pagination';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller({ path: 'anime/releases/reviews', version: '1' })
export class ReviewsController {
  public constructor(private readonly reviewsService: ReviewsService) {}

  @SoftAuthorization()
  @Get('/by-release/:releaseId')
  public async getReviewsByReleaseId(
    @Param('releaseId') releaseId: string,
    @Authorized('id') viewerId?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('sortBy') sortBy?: 'newest' | 'oldest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.reviewsService.getReviewsByReleaseId(
      releaseId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @SoftAuthorization()
  @Get('/user/:userId')
  public async getUserReviews(
    @Param('userId') userId: string,
    @Authorized('id') viewerId?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('sortBy') sortBy?: 'newest' | 'oldest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.reviewsService.getUserReviews(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @SoftAuthorization()
  @Get('/review/:reviewId')
  public async getReview(
    @Param('reviewId')
    reviewId: string,
    @Authorized('id')
    viewerId?: string,
  ) {
    const result = await this.reviewsService.getReview(reviewId, viewerId);
    return wrapApiResponse(result);
  }

  @SoftAuthorization()
  @Get('/user-ratings/:userId')
  public async getUserRatings(
    @Authorized('id') viewerId: string,
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('sortBy') sortBy?: 'newest' | 'oldest',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.reviewsService.getUserRatings(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @Get('/rating/:animeId')
  public async getRating(
    @Param('animeId')
    animeId: string,
  ) {
    const result = await this.reviewsService.getRating(animeId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post('/create/:animeId')
  public async createReview(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Body() dto: CreateReviewDto,
  ) {
    console.log(dto, userId, animeId);
    const result = await this.reviewsService.createReview(userId, animeId, dto);
    console.log(result);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post('create-empty/:animeId/:rating')
  public async createEmptyReview(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Param('rating') rating: number,
  ) {
    const result = await this.reviewsService.createEmptyReview(
      userId,
      animeId,
      Number(rating) || 1,
    );
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post('like/:reviewId')
  public async likeReview(
    @Authorized('id') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    const result = await this.reviewsService.likeReview(userId, reviewId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Patch('/update/:animeId')
  public async updateReview(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const result = await this.reviewsService.updateReview(userId, animeId, dto);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Delete('/delete/:reviewId')
  public async deleteReview(
    @Authorized('id') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    const result = await this.reviewsService.deleteReview(userId, reviewId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Delete('/unlike/:reviewId')
  public async unlikeReview(
    @Authorized('id') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    const result = await this.reviewsService.unlikeReview(userId, reviewId);
    return wrapApiResponse(result);
  }
}
