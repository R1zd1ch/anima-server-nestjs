import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CollectionsService } from './collections.service';
import { AnimeCollectionType } from '@prisma/__generated__';

@Controller({
  path: 'anime/user/watch-progress',
  version: '1',
})
export class CollectionsController {
  public constructor(private readonly collectionsService: CollectionsService) {}

  @MessagePattern({ cmd: 'get-collections' })
  async getCollections(@Payload() data: { userId: string }) {
    return this.collectionsService.getCollections(data.userId);
  }

  @MessagePattern({ cmd: 'get-full-analytics' })
  async getFullAnalytics(@Payload() userId: string) {
    return this.collectionsService.getFullAnalytics(userId);
  }

  @MessagePattern({ cmd: 'get-collection-details' })
  async getCollectionDetails(
    @Payload() data: { userId: string; collectionId: string },
  ) {
    const { userId, collectionId } = data;
    return this.collectionsService.getCollectionDetails(userId, collectionId);
  }

  @MessagePattern({ cmd: 'create-collection' })
  async createCollection(
    @Payload()
    data: {
      userId: string;
      title: string;
      description?: string;
      type?: AnimeCollectionType;
      isPublic?: boolean;
    },
  ) {
    const { userId, ...rest } = data;

    return this.collectionsService.createCollection(userId, rest);
  }

  @MessagePattern({ cmd: 'delete-collection' })
  async deleteCollection(
    @Payload() data: { userId: string; collectionId: string },
  ) {
    const { userId, collectionId } = data;
    return this.collectionsService.deleteCollection(userId, collectionId);
  }

  @MessagePattern({ cmd: 'update-collection' })
  async updateCollection(
    @Payload()
    data: {
      userId: string;
      collectionId: string;
      data: {
        title?: string;
        description?: string;
        type?: AnimeCollectionType;
        isPublic?: boolean;
      };
    },
  ) {
    const { userId, collectionId, data: updateData } = data;
    return this.collectionsService.updateCollection(
      userId,
      collectionId,
      updateData,
    );
  }

  @MessagePattern({ cmd: 'like-collection' })
  async likeCollection(
    @Payload() data: { userId: string; collectionId: string },
  ) {
    const { userId, collectionId } = data;
    return this.collectionsService.likeCollection(userId, collectionId);
  }

  @MessagePattern({ cmd: 'unlike-collection' })
  async unlikeCollection(
    @Payload() data: { userId: string; collectionId: string },
  ) {
    const { userId, collectionId } = data;
    return this.collectionsService.unlikeCollection(userId, collectionId);
  }

  @MessagePattern({ cmd: 'get-collection-likes' })
  async getCollectionLikes(
    @Payload()
    data: {
      collectionId: string;
      currentUserId?: string;
    },
  ) {
    const { collectionId, currentUserId } = data;
    return this.collectionsService.getCollectionLikes(
      collectionId,
      currentUserId,
    );
  }

  @MessagePattern({ cmd: 'get-liked-collections' })
  async getLikedCollections(@Payload() userId: string) {
    return this.collectionsService.getUserLikedCollections(userId);
  }
}
