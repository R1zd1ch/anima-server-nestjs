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
import { CollectionsService } from './collections.service';
import { Authorized } from 'apps/anime-microservice/src/decorators/authorized.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateAnimeNoteDto } from './dto/update-anime-note-in-collection.dto';
import { AddAnimeToCollectionDto } from './dto/add-anime-to-collection.dto';
import { SoftAuthorization } from 'apps/anime-microservice/src/decorators/soft-auth.decorator';
import { parsePagination } from 'shared/lib/utils/parse-pagination';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import {
  ApiCookieAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Anime/User/Collections')
@ApiCookieAuth('Authorization')
@Controller({
  path: 'anime/user/collections',
  version: '1',
})
export class CollectionsController {
  public constructor(private readonly collectionsService: CollectionsService) {}

  @ApiOperation({
    summary: 'Получить список коллекций',
    description:
      'Возвращает постраничный список аниме коллекций с возможностью сортировки.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице (по умолчанию: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'oldest', 'top'],
    description:
      'Метод сортировки: newest (новые), oldest (старые), top (по лайкам)',
    example: 'newest',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный запрос. Возвращает список коллекций',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @SoftAuthorization()
  @Get()
  public async getCollections(
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'oldest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.collectionsService.getCollections(
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить коллекцию по ID',
    description: 'Возвращает детальную информацию о конкретной коллекции.',
  })
  @ApiParam({
    name: 'collectionId',
    type: String,
    description: 'ID коллекции для получения',
    example: '5f8d8f9d8f9d8f9d8f9d8f9d',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный запрос. Возвращает данные коллекции',
  })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @SoftAuthorization()
  @Get(':collectionId')
  public async getCollection(
    @Authorized('id') viewerId: string | undefined,
    @Param('collectionId') collectionId: string,
  ) {
    const result = await this.collectionsService.getCollection(
      collectionId,
      viewerId,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Получить метрики коллекции',
    description:
      'Возвращает различные метрики коллекции: жанры, темы, рейтинги и т.д.',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Метрики успешно получены',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа к приватной коллекции',
  })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @SoftAuthorization()
  @Get(':collectionId/metrics')
  public async getAllMetricsFromCollection(
    @Param('collectionId') collectionId: string,
    @Authorized('id') viewerId: string,
  ) {
    const result = await this.collectionsService.getAllMetricsFromCollection(
      collectionId,
      viewerId,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Получить коллекции пользователя',
    description: 'Возвращает список коллекций определенного пользователя',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице (по умолчанию: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'top'],
    description: 'Метод сортировки: newest (новые), top (по лайкам)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список коллекций успешно получен',
  })
  @SoftAuthorization()
  @Get('user-collections/:userId')
  public async getUserCollections(
    @Authorized('id') viewerId: string,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'newest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.collectionsService.getUserCollections(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Получить лайкнутые коллекции пользователя',
    description: 'Возвращает список коллекций, которые лайкнул пользователь',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице (по умолчанию: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'top'],
    description: 'Метод сортировки: newest (новые), top (по лайкам)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список лайкнутых коллекций успешно получен',
  })
  @SoftAuthorization()
  @Get('user-liked-collections/:userId')
  @SoftAuthorization()
  @Get('user-liked-collections/:userId')
  public async getUserLikedCollections(
    @Authorized('id') viewerId: string,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'newest' | 'top',
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.collectionsService.getUserLikedCollections(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return wrapApiResponse(result, true);
  }

  @ApiOperation({
    summary: 'Создать новую коллекцию',
    description: 'Создает новую коллекцию аниме',
  })
  @ApiResponse({
    status: 201,
    description: 'Коллекция успешно создана',
  })
  @ApiBody({
    type: CreateCollectionDto,
    description: 'Данные для создания коллекции',
    examples: {
      example1: {
        summary: 'Пример 1',
        value: {
          title: 'Мои любимые аниме',
          description: 'Это моя коллекция любимых аниме',
          isPrivate: false,
        } as CreateCollectionDto,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Authorization()
  @Post()
  public async createCollection(
    @Authorized('id') viewerId: string,
    @Body() dto: CreateCollectionDto,
  ) {
    const result = await this.collectionsService.createCollection(
      viewerId,
      dto,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Обновить коллекцию',
    description: 'Обновляет информацию о коллекции',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Коллекция успешно обновлена',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @ApiBody({
    type: UpdateCollectionDto,
    description: 'Данные для обновления коллекции',
    examples: {
      example1: {
        summary: 'Пример обновления',
        value: {
          title: 'Новое название коллекции',
          description: 'Обновленное описание коллекции',
          isPrivate: true,
        } as UpdateCollectionDto,
      },
    },
  })
  @Authorization()
  @Patch(':collectionId')
  public async updateCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const result = await this.collectionsService.updateCollection(
      userId,
      collectionId,
      dto,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Удалить коллекцию',
    description: 'Удаляет коллекцию',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Коллекция успешно удалена',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @Authorization()
  @Delete(':collectionId')
  public async deleteCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    const result = await this.collectionsService.deleteCollection(
      userId,
      collectionId,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Лайкнуть коллекцию',
    description: 'Ставит лайк коллекции',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно поставлен',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @Authorization()
  @Post(':collectionId/like')
  public async likeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    const result = await this.collectionsService.likeCollection(
      userId,
      collectionId,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Убрать лайк с коллекции',
    description: 'Убирает лайк с коллекции',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Лайк успешно убран',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  @Authorization()
  @Delete(':collectionId/unlike')
  public async unlikeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    const result = await this.collectionsService.unlikeCollection(
      userId,
      collectionId,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Добавить аниме в коллекцию',
    description: 'Добавляет аниме в коллекцию',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Аниме успешно добавлено в коллекцию',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Коллекция или аниме не найдены' })
  @ApiBody({
    type: AddAnimeToCollectionDto,
    description: 'Данные для добавления аниме',
    examples: {
      example1: {
        summary: 'Пример добавления',
        value: {
          animeId: '507f1f77bcf86cd799439011',
          note: 'Отличное аниме, обязательно к просмотру',
        } as AddAnimeToCollectionDto,
      },
    },
  })
  @Authorization()
  @Post(':collectionId/add-anime')
  public async addAnimeToCollection(
    @Authorized('id') userId: string,
    @Body() dto: AddAnimeToCollectionDto,
    @Param('collectionId') collectionId: string,
  ) {
    const result = await this.collectionsService.addAnimeToCollection(
      userId,
      collectionId,
      dto,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Обновить заметку к аниме в коллекции',
    description: 'Обновляет заметку к аниме в коллекции',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Заметка успешно обновлена',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Коллекция или аниме не найдены' })
  @ApiBody({
    type: UpdateAnimeNoteDto,
    description: 'Данные для обновления заметки',
    examples: {
      example1: {
        summary: 'Пример обновления заметки',
        value: {
          animeId: '507f1f77bcf86cd799439011',
          note: 'Пересмотрел, всё так же круто!',
        } as UpdateAnimeNoteDto,
      },
    },
  })
  @Authorization()
  @Patch(':collectionId/update-anime-note')
  public async updateAnimeNoteInCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Body() dto: UpdateAnimeNoteDto,
  ) {
    const result = await this.collectionsService.updateAnimeNoteInCollection(
      userId,
      collectionId,
      dto,
    );
    return wrapApiResponse(result);
  }

  @ApiOperation({
    summary: 'Удалить аниме из коллекции',
    description: 'Удаляет аниме из коллекции',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'ID коллекции',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'animeId',
    description: 'ID аниме',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Аниме успешно удалено из коллекции',
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Коллекция или аниме не найдены' })
  @Authorization()
  @Delete(':collectionId/remove-anime/:animeId')
  public async removeAnimeFromCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Param('animeId') animeId: string,
  ) {
    const result = await this.collectionsService.removeAnimeFromCollection(
      userId,
      collectionId,
      animeId,
    );
    return wrapApiResponse(result);
  }
}
