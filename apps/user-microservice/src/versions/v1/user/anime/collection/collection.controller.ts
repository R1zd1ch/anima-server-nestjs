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
import { CollectionsService } from './collection.service';
import { Authorization } from 'shared/decorators/auth.decorator';
import { Authorized } from 'shared/decorators/authorized.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User/Anime/Collection')
@ApiCookieAuth()
@Controller({ version: '1', path: 'user/anime/collection' })
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Получить список коллекций пользователя' })
  @ApiResponse({ status: 200, description: 'Список коллекций успешно получен' })
  public async getCollections(@Authorized('id') userId: string) {
    return this.collectionsService.getCollections(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('analytics')
  @ApiOperation({ summary: 'Получить аналитику по коллекциям' })
  @ApiResponse({ status: 200, description: 'Аналитика успешно получена' })
  public async getFullAnalytics(@Authorized('id') userId: string) {
    return this.collectionsService.getFullAnalytics(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('liked')
  @ApiOperation({ summary: 'Получить понравившиеся коллекции пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Понравившиеся коллекции успешно получены',
  })
  public async getLikedCollections(@Authorized('id') userId: string) {
    return this.collectionsService.getLikedCollections(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Создать новую коллекцию' })
  @ApiResponse({ status: 200, description: 'Коллекция успешно создана' })
  public async createCollection(
    @Authorized('id') userId: string,
    @Body()
    dto: CreateCollectionDto,
  ) {
    return this.collectionsService.createCollection(
      userId,
      dto.title,
      dto.description,
      dto.type,
      dto.isPublic,
    );
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Put(':collectionId')
  @ApiOperation({ summary: 'Обновить коллекцию' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Коллекция успешно обновлена' })
  public async updateCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Body()
    dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.updateCollection(
      userId,
      collectionId,
      dto.title,
      dto.description,
      dto.type,
      dto.isPublic,
    );
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Delete(':collectionId')
  @ApiOperation({ summary: 'Удалить коллекцию' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Коллекция успешно удалена' })
  public async deleteCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.deleteCollection(userId, collectionId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post(':collectionId/like')
  @ApiOperation({ summary: 'Поставить лайк коллекции' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Лайк успешно добавлен' })
  public async likeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.likeCollection(userId, collectionId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Delete(':collectionId/like')
  @ApiOperation({ summary: 'Убрать лайк с коллекции' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Лайк успешно удалён' })
  public async unlikeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.unlikeCollection(userId, collectionId);
  }

  @Get(':collectionId')
  @ApiOperation({ summary: 'Получить детали коллекции' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Информация о коллекции получена' })
  public async getCollectionDetails(@Param('collectionId') id: string) {
    return this.collectionsService.getCollectionDetails('', id);
  }

  @Get(':collectionId/likes')
  @ApiOperation({ summary: 'Получить количество лайков у коллекции' })
  @ApiParam({ name: 'collectionId', description: 'ID коллекции' })
  @ApiResponse({ status: 200, description: 'Информация о лайках получена' })
  public async getCollectionLikes(@Param('collectionId') collectionId: string) {
    return this.collectionsService.getCollectionLikes(collectionId);
  }
}
