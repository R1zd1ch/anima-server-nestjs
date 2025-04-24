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

@Controller({ version: '1', path: 'user/anime/collection' })
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getCollections(@Authorized('id') userId: string) {
    return this.collectionsService.getCollections(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('analytics')
  public async getFullAnalytics(@Authorized('id') userId: string) {
    return this.collectionsService.getFullAnalytics(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('liked')
  public async getLikedCollections(@Authorized('id') userId: string) {
    return this.collectionsService.getLikedCollections(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post()
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
  public async deleteCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.deleteCollection(userId, collectionId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post(':collectionId/like')
  public async likeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.likeCollection(userId, collectionId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Delete(':collectionId/like')
  public async unlikeCollection(
    @Authorized('id') userId: string,
    @Param('collectionId') collectionId: string,
  ) {
    return this.collectionsService.unlikeCollection(userId, collectionId);
  }

  @Get(':collectionId')
  public async getCollectionDetails(@Param('collectionId') id: string) {
    return this.collectionsService.getCollectionDetails('', id);
  }

  @Get(':collectionId/likes')
  public async getCollectionLikes(@Param('collectionId') collectionId: string) {
    return this.collectionsService.getCollectionLikes(collectionId);
  }
}
