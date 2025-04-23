import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AnimeCollectionType } from '@prisma/__generated__';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CollectionsService {
  public constructor(
    @Inject('ANIME_COLLECTIONS') private readonly animeClient: ClientProxy,
  ) {}

  public async getCollections(userId: string): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send({ cmd: 'get-collections' }, { userId }),
    );
  }

  public async getFullAnalytics(userId: string): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send({ cmd: 'get-full-analytics' }, userId),
    );
  }

  public async getCollectionDetails(
    userId: string,
    collectionId: string,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'get-collection-details' },
        {
          userId,
          collectionId,
        },
      ),
    );
  }

  public async getCollectionLikes(collectionId: string): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'get-collection-likes' },
        {
          collectionId,
        },
      ),
    );
  }

  public async getLikedCollections(userId: string): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send({ cmd: 'get-liked-collections' }, userId),
    );
  }

  public async createCollection(
    userId: string,
    title: string,
    description?: string,
    type?: AnimeCollectionType,
    isPublic?: boolean,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'create-collection' },
        {
          userId,
          title,
          description,
          type,
          isPublic,
        },
      ),
    );
  }

  public async updateCollection(
    userId: string,
    collectionId: string,
    title?: string,
    description?: string,
    type?: AnimeCollectionType,
    isPublic?: boolean,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'update-collection' },
        {
          userId,
          collectionId,
          title,
          description,
          type,
          isPublic,
        },
      ),
    );
  }

  public async deleteCollection(
    userId: string,
    collectionId: string,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'delete-collection' },
        { userId, collectionId },
      ),
    );
  }

  public async likeCollection(
    userId: string,
    collectionId: string,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'like-collection' },
        { userId, collectionId },
      ),
    );
  }

  public async unlikeCollection(
    userId: string,
    collectionId: string,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'unlike-collection' },
        { userId, collectionId },
      ),
    );
  }
}
