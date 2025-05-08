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

@Controller({ path: 'anime/episodes/comments', version: '1' })
export class CommentsController {
  public constructor(private readonly commentsService: CommentsService) {}

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

  @Authorization()
  @Post('comment/:id/like')
  public async likeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.likeComment(userId, id);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Delete('comment/:id/unlike')
  public async unlikeComment(
    @Authorized('id') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.commentsService.unlikeComment(userId, id);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post('comment')
  public async createComment(
    @Body() dto: CreateCommentDto,
    @Authorized('id') userId: string,
  ) {
    const result = await this.commentsService.createComment(dto, userId);
    return wrapApiResponse(result);
  }

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
