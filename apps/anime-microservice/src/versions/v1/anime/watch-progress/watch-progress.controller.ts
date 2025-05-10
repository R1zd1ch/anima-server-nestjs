import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WatchProgressService } from './watch-progress.service';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';
import { Authorized } from 'apps/anime-microservice/src/decorators/authorized.decorator';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { SoftAuthorization } from 'apps/anime-microservice/src/decorators/soft-auth.decorator';
import { ProgressUpdateDto } from './dto/response-progress.dto';

@Controller({
  version: '1',
  path: 'anime/user/watch-progress',
})
export class WatchProgressController {
  public constructor(
    private readonly watchProgressService: WatchProgressService,
  ) {}
  @Authorization()
  @Get()
  public async getAll(@Authorized('id') userId: string) {
    const result = await this.watchProgressService.getUserProgress(userId);
    return wrapApiResponse(result);
  }

  @SoftAuthorization()
  @Get('user-progress/:userId')
  public async getUserProgress(
    @Param('userId') userId: string,
    @Authorized('id') viewerId: string,
  ) {
    const result = await this.watchProgressService.getUserProgress(
      userId,
      viewerId,
    );
    return wrapApiResponse(result);
  }

  @Authorization()
  @Get(':animeId')
  public async getOne(
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.watchProgressService.getProgressForAnime(
      userId,
      animeId,
    );
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post(':animeId')
  update(
    @Param('animeId') animeId: string,
    @Body() dto: ProgressUpdateDto,
    @Authorized('id') userId: string,
  ) {
    const result = this.watchProgressService.updateProgress(
      userId,
      animeId,
      dto,
    );
    return wrapApiResponse(result);
  }

  @Authorization()
  @Patch(':animeId')
  public async markWatched(
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.watchProgressService.markWatched(userId, animeId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Delete(':animeId')
  public async delete(
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.watchProgressService.deleteProgress(
      userId,
      animeId,
    );
    return wrapApiResponse(result);
  }
}
