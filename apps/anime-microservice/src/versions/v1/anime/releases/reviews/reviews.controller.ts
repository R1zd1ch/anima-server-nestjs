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
import {
  ApiCookieAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Anime/Releases/Reviews')
@ApiCookieAuth()
@Controller({ path: 'anime/releases/reviews', version: '1' })
export class ReviewsController {
  public constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Получить отзывы к релизу',
    description: 'Возвращает список отзывов к определенному релизу аниме',
  })
  @ApiParam({
    name: 'releaseId',
    description: 'ID релиза',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество элементов на странице',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    description:
      'Сортировка: newest (новые), oldest (старые), top (популярные)',
    enum: ['newest', 'oldest', 'top'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список отзывов успешно получен',
  })
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

  @ApiOperation({
    summary: 'Получить отзывы пользователя',
    description: 'Возвращает список отзывов определенного пользователя',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество элементов на странице',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    description:
      'Сортировка: newest (новые), oldest (старые), top (популярные)',
    enum: ['newest', 'oldest', 'top'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список отзывов пользователя успешно получен',
  })
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

  @ApiOperation({
    summary: 'Получить отзыв',
    description: 'Возвращает детальную информацию об отзыве',
  })
  @ApiParam({
    name: 'reviewId',
    description: 'ID отзыва',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Отзыв успешно получен',
  })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
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

  @ApiOperation({
    summary: 'Получить оценки пользователя',
    description: 'Возвращает список оценок аниме от пользователя',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество элементов на странице',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Сортировка: newest (новые), oldest (старые)',
    enum: ['newest', 'oldest'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список оценок успешно получен',
  })
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

  @ApiOperation({
    summary: 'Получить рейтинг аниме',
    description:
      'Возвращает общий рейтинг аниме на основе оценок пользователей',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Рейтинг успешно получен',
  })
  @Get('/rating/:animeId')
  public async getRating(
    @Param('animeId')
    animeId: string,
  ) {
    const result = await this.reviewsService.getRating(animeId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Создать отзыв',
    description: 'Создает новый отзыв на аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Данные для создания отзыва',
    examples: {
      example1: {
        summary: 'Пример создания отзыва',
        value: {
          text: 'Отличное аниме, рекомендую к просмотру!',
          rating: 9,
        } as CreateReviewDto,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Отзыв успешно создан',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
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

  @ApiOperation({
    summary: 'Создать пустой отзыв',
    description: 'Создает отзыв только с оценкой без текста',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'rating',
    description: 'Оценка (от 1 до 10)',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Пустой отзыв успешно создан',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
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

  @ApiOperation({
    summary: 'Лайкнуть отзыв',
    description: 'Ставит лайк на отзыв',
  })
  @ApiParam({
    name: 'reviewId',
    description: 'ID отзыва',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно поставлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Authorization()
  @Post('like/:reviewId')
  public async likeReview(
    @Authorized('id') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    const result = await this.reviewsService.likeReview(userId, reviewId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Обновить отзыв',
    description: 'Обновляет существующий отзыв',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiBody({
    type: UpdateReviewDto,
    description: 'Данные для обновления отзыва',
    examples: {
      example1: {
        summary: 'Пример обновления отзыва',
        value: {
          text: 'Обновленный текст отзыва',
          rating: 8,
        } as UpdateReviewDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Отзыв успешно обновлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
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

  @ApiOperation({
    summary: 'Удалить отзыв',
    description: 'Удаляет отзыв',
  })
  @ApiParam({
    name: 'reviewId',
    description: 'ID отзыва',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Отзыв успешно удален',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Authorization()
  @Delete('/delete/:reviewId')
  public async deleteReview(
    @Authorized('id') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    const result = await this.reviewsService.deleteReview(userId, reviewId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Убрать лайк с отзыва',
    description: 'Убирает лайк с отзыва',
  })
  @ApiParam({
    name: 'reviewId',
    description: 'ID отзыва',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно убран',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
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
