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
import { ApiResponseUtil } from 'shared/lib/utils/api-response';
import { Authorized } from 'apps/anime-microservice/src/decorators/authorized.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';

@Controller({ path: 'anime/episodes/comments', version: '1' })
export class CommentsConroller {
  public constructor(private readonly commentsService: CommentsService) {}

  @Get(':animeId')
  public async getCommentsByAnime(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'top',
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const result = await this.commentsService.getCommentsByAnime(
      animeId,
      pageNumber,
      limitNumber,
      sortBy,
      userId,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @Get('replies/:commentId')
  public async getCommentReplies(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('commentId') commentId: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const result = await this.commentsService.getCommentReplies(
      commentId,
      pageNumber,
      limitNumber,
    );

    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @Authorization()
  @Get('user/:userId')
  public async getUserComments(
    @Param('userId') userId: string,
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'top',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const result = await this.commentsService.getUserComments(
      userId,
      viewerId,
      pageNumber,
      limitNumber,
      sortBy,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @Authorization()
  @Get('user/:userId/likes')
  public async getUserLikes(
    @Param('userId') userId: string,
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'oldest',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const result = await this.commentsService.getUserLikes(
      userId,
      viewerId,
      pageNumber,
      limitNumber,
      sortBy,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @Authorization()
  @Post('comment/:id/like')
  public async likeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.likeComment(userId, id);
    return ApiResponseUtil.success(result);
  }

  @Authorization()
  @Delete('comment/:id/unlike')
  public async unlikeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.unlikeComment(userId, id);
    return ApiResponseUtil.success(result);
  }

  @Authorization()
  @Post('comment')
  public async createComment(
    @Body() dto: CreateCommentDto,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.createComment(dto, userId);
    return ApiResponseUtil.success(result);
  }

  @Authorization()
  @Patch('comment/:id')
  public async updateComment(
    @Body() dto: UpdateCommentDto,
    @Param() id: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.updateComment(id, dto, userId);
    return ApiResponseUtil.success(result);
  }

  @Authorization()
  @Delete('comment/:id')
  public async deleteComment(
    @Param() id: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.deleteComment(id, userId);
    return ApiResponseUtil.success(result);
  }
}
