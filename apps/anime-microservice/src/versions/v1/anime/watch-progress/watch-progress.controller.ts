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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Anime/User/Watch Progress')
@Controller({
  version: '1',
  path: 'anime/user/watch-progress',
})
export class WatchProgressController {
  public constructor(
    private readonly watchProgressService: WatchProgressService,
  ) {}

  @ApiOperation({
    summary: 'Получить весь прогресс просмотра',
    description:
      'Возвращает прогресс просмотра всех аниме для текущего пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Прогресс просмотра успешно получен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Authorization()
  @Get()
  public async getAll(@Authorized('id') userId: string) {
    const result = await this.watchProgressService.getUserProgress(userId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Получить прогресс просмотра пользователя',
    description:
      'Возвращает прогресс просмотра всех аниме для указанного пользователя',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Прогресс просмотра пользователя успешно получен',
  })
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

  @ApiOperation({
    summary: 'Получить прогресс просмотра аниме',
    description: 'Возвращает прогресс просмотра конкретного аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Прогресс просмотра аниме успешно получен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Аниме не найдено' })
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

  @ApiOperation({
    summary: 'Обновить прогресс просмотра',
    description: 'Обновляет прогресс просмотра аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiBody({
    type: ProgressUpdateDto,
    description: 'Данные для обновления прогресса',
    examples: {
      example1: {
        summary: 'Пример обновления прогресса',
        value: {
          episode: 5,
          time: 120,
          duration: 1440,
        } as ProgressUpdateDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Прогресс просмотра успешно обновлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Аниме не найдено' })
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

  @ApiOperation({
    summary: 'Отметить аниме как просмотренное',
    description: 'Отмечает аниме как полностью просмотренное',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Аниме успешно отмечено как просмотренное',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Аниме не найдено' })
  @Authorization()
  @Patch(':animeId')
  public async markWatched(
    @Param('animeId') animeId: string,
    @Authorized('id') userId: string,
  ) {
    const result = await this.watchProgressService.markWatched(userId, animeId);
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Удалить прогресс просмотра',
    description: 'Удаляет прогресс просмотра аниме',
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Прогресс просмотра успешно удален',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Аниме не найдено' })
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
