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
import { ApiResponseUtil } from 'shared/lib/utils/api-response';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Authorization } from 'apps/anime-microservice/src/decorators/auth.decorator';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateAnimeNoteDto } from './dto/update-anime-note-in-collection.dto';
import { AddAnimeToCollectionDto } from './dto/add-anime-to-collection.dto';
import { SoftAuthorization } from 'apps/anime-microservice/src/decorators/soft-auth.decorator';

@Controller({
  path: 'anime/user/collections',
  version: '1',
})
export class CollectionsController {
  public constructor(private readonly collectionsService: CollectionsService) {}

  @SoftAuthorization()
  @Get()
  public async getCollections(
    @Authorized('id') viewerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'newest' | 'oldest' | 'top',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const result = await this.collectionsService.getCollections(
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

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
    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }

  @SoftAuthorization()
  @Get('user-collections/:userId')
  public async getUserCollections(
    @Authorized('id') viewerId: string,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'newest' | 'top',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const result = await this.collectionsService.getUserCollections(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );

    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

  @SoftAuthorization()
  @Get('user-liked-collections/:userId')
  public async getUserLikedCollections(
    @Authorized('id') viewerId: string,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'newest' | 'top',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const result = await this.collectionsService.getUserLikedCollections(
      userId,
      pageNumber,
      limitNumber,
      sortBy,
      viewerId,
    );
    return ApiResponseUtil.withMeta(result.data, result.meta);
  }

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
    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }

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

    return ApiResponseUtil.success(result);
  }

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

    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }

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
    return ApiResponseUtil.success(result);
  }
}
