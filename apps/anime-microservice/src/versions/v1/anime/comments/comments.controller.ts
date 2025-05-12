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
import { CommentsService } from './comments.service';
import { Authorized } from 'apps/anime-microservice/src/decorators/authorized.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';
import { SoftAuthorization } from 'apps/anime-microservice/src/decorators/soft-auth.decorator';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { parsePagination } from 'shared/lib/utils/parse-pagination';
import {
  ApiCookieAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Anime/Comments')
@ApiCookieAuth()
@Controller({ path: 'anime/episodes/comments', version: '1' })
export class CommentsController {
  public constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Получить комментарии к аниме',
    description: 'Возвращает список комментариев к определенному аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
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
    description: 'Сортировка: newest (новые), top (популярные)',
    enum: ['newest', 'top'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев успешно получен',
  })
  @SoftAuthorization()
  @Get(':animeId')
  public async getCommentsByAnime(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'top',
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.commentsService.getCommentsByAnime(
      animeId,
      pageNumber,
      limitNumber,
      sortBy,
      userId,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить ответы на комментарий',
    description: 'Возвращает список ответов на определенный комментарий',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID комментария',
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
  @ApiResponse({
    status: 200,
    description: 'Список ответов успешно получен',
  })
  @Get('replies/:commentId')
  public async getCommentReplies(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('commentId') commentId: string,
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.commentsService.getCommentReplies(
      commentId,
      pageNumber,
      limitNumber,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить комментарии пользователя',
    description: 'Возвращает список комментариев определенного пользователя',
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
    description: 'Сортировка: newest (новые), top (популярные)',
    enum: ['newest', 'top'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев пользователя успешно получен',
  })
  @SoftAuthorization()
  @Get('user/:userId')
  public async getUserComments(
    @Param('userId') userId: string,
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.commentsService.getUserComments(
      userId,
      viewerId,
      pageNumber,
      limitNumber,
      sortBy,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить лайкнутые комментарии пользователя',
    description: 'Возвращает список комментариев, которые лайкнул пользователь',
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
    description: 'Список лайкнутых комментариев успешно получен',
  })
  @SoftAuthorization()
  @Get('user/:userId/likes')
  public async getUserLikes(
    @Param('userId') userId: string,
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'oldest',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.commentsService.getUserLikes(
      userId,
      viewerId,
      pageNumber,
      limitNumber,
      sortBy,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить комментарии к эпизоду аниме',
    description: 'Возвращает список комментариев к определенному эпизоду аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'episode',
    description: 'Номер эпизода',
    type: Number,
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
    description: 'Сортировка: newest (новые), top (популярные)',
    enum: ['newest', 'top'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев к эпизоду успешно получен',
  })
  @SoftAuthorization()
  @Get(':animeId/:episode')
  public async getCommentsByAnimeAndEpisode(
    @Param('animeId') animeId: string,
    @Param('episode') episode: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'top',
    @Authorized('id') userId: string,
  ) {
    const episodeNumber = Number(episode) || 1;
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.commentsService.getCommentsByAnimeAndEpisode(
      animeId,
      episodeNumber,
      pageNumber,
      limitNumber,
      sortBy,
      userId,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Лайкнуть комментарий',
    description: 'Ставит лайк на комментарий',
  })
  @ApiParam({
    name: 'id',
    description: 'ID комментария',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно поставлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Authorization()
  @Post('comment/:id/like')
  public async likeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.likeComment(userId, id);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Создать комментарий',
    description: 'Создает новый комментарий',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Данные для создания комментария',
    examples: {
      example1: {
        summary: 'Пример создания комментария',
        value: {
          content: 'Отличное аниме!',
          animeId: '507f1f77bcf86cd799439011',
          episode: 1,
          parentId: null,
        } as CreateCommentDto,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно создан',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Authorization()
  @Post('comment')
  public async createComment(
    @Body() dto: CreateCommentDto,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.createComment(dto, userId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Обновить комментарий',
    description: 'Обновляет существующий комментарий',
  })
  @ApiParam({
    name: 'id',
    description: 'ID комментария',
    type: String,
    required: true,
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Данные для обновления комментария',
    examples: {
      example1: {
        summary: 'Пример обновления комментария',
        value: {
          content: 'Обновленный текст комментария',
        } as UpdateCommentDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно обновлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @Authorization()
  @Authorization()
  @Patch('comment/:id')
  public async updateComment(
    @Body() dto: UpdateCommentDto,
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.updateComment(id, dto, userId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Убрать лайк с комментария',
    description: 'Убирает лайк с комментария',
  })
  @ApiParam({
    name: 'id',
    description: 'ID комментария',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно убран',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Authorization()
  @Delete('comment/:id/unlike')
  public async unlikeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.unlikeComment(userId, id);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Удалить комментарий',
    description: 'Удаляет комментарий',
  })
  @ApiParam({
    name: 'id',
    description: 'ID комментария',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно удален',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @Authorization()
  @Delete('comment/:id')
  public async deleteComment(
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.deleteComment(id, userId);
    return wrapApiResponse(result);
  }
}
