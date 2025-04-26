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
import { Authorization } from 'shared/decorators/auth.decorator';
import { Authorized } from 'shared/decorators/authorized.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('User/Anime/WatchProgress')
@ApiCookieAuth()
@Controller({
  version: '1',
  path: 'user/anime/watch-progress',
})
export class WatchProgressController {
  constructor(private readonly progressService: WatchProgressService) {}

  @Authorization()
  @Post(':animeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать прогресс просмотра для аниме' })
  @ApiParam({ name: 'animeId', description: 'ID аниме' })
  @ApiResponse({ status: 201, description: 'Прогресс успешно создан' })
  async createProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
    @Body() dto: ProgressCreateDto,
  ) {
    return this.progressService.createProgress(userId, animeId, dto);
  }

  @Authorization()
  @Get(':animeId')
  @ApiOperation({ summary: 'Получить прогресс просмотра по аниме' })
  @ApiParam({ name: 'animeId', description: 'ID аниме' })
  @ApiResponse({ status: 200, description: 'Прогресс успешно получен' })
  async getProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
  ) {
    return this.progressService.getProgress(userId, animeId);
  }

  @Authorization()
  @Put(':animeId')
  @ApiOperation({ summary: 'Обновить прогресс просмотра по аниме' })
  @ApiParam({ name: 'animeId', description: 'ID аниме' })
  @ApiResponse({ status: 200, description: 'Прогресс успешно обновлён' })
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
  @ApiOperation({ summary: 'Удалить прогресс просмотра по аниме' })
  @ApiParam({ name: 'animeId', description: 'ID аниме' })
  @ApiResponse({ status: 204, description: 'Прогресс успешно удалён' })
  async deleteProgress(
    @Authorized('id') userId: string,
    @Param('animeId') animeId: string,
  ) {
    return this.progressService.deleteProgress(userId, animeId);
  }
}
