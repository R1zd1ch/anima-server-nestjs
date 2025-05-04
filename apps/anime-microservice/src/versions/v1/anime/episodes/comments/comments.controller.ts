import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiResponseUtil } from 'shared/lib/utils/api-response';

@Controller({ path: 'anime/episodes/comments', version: '1' })
export class CommentsConroller {
  public constructor(private readonly commentsService: CommentsService) {}

  @Get(':animeId')
  public async getCommentsByAnime(
    @Query('page') page,
    @Query('limit') limit,
    @Query('sortBy') sortBy: 'newest' | 'top',
    @Param('animeId') animeId: string,
  ) {
    const result = await this.commentsService.getCommentsByAnime(
      animeId,
      +page,
      +limit,
      sortBy,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @Get('replies/:commentId')
  public async getCommentReplies(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.commentsService.getCommentReplies(
      commentId,
      +page,
      +limit,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }
}
