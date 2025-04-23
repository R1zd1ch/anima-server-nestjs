import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WatchProgressService } from './watch-progress.service';
import { ProgressCreateDto } from './dto/create-progress.dto';
import { Authorization } from '../../../auth/decorators/auth.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';

@Controller({
  version: '1',
  path: 'user/anime/watch-progress',
})
export class WatchProgressController {
  constructor(private readonly progressService: WatchProgressService) {}

  @Authorization()
  @Post(':animeId')
  @HttpCode(HttpStatus.CREATED)
  async createProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Body() dto: ProgressCreateDto,
  ) {
    return this.progressService.createProgress(userId, animeId, dto);
  }

  @Authorization()
  @Get(':animeId')
  async getProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
  ) {
    return this.progressService.getProgress(userId, animeId);
  }

  @Authorization()
  @Put(':animeId')
  async updateProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Body() dto: ProgressCreateDto,
  ) {
    return this.progressService.updateTimeCodes(userId, animeId, dto);
  }

  @Authorization()
  @Delete(':animeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
  ) {
    return this.progressService.deleteProgress(userId, animeId);
  }
}
