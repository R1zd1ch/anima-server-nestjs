import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProgressCreateDto } from './dto/create-progress.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WatchProgressService {
  public constructor(
    @Inject('ANIME_WATCH_PROGRESS') private readonly animeClient: ClientProxy,
  ) {}

  public async createProgress(
    userId: string,
    animeId: string,
    dto: ProgressCreateDto,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'create-progress' },
        { userId, animeId, dto },
      ),
    );
  }

  public async getProgress(userId: string, animeId: string): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send({ cmd: 'get-progress' }, { userId, animeId }),
    );
  }

  public async updateTimeCodes(
    userId: string,
    animeId: string,
    dto: ProgressCreateDto,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send(
        { cmd: 'update-time-codes' },
        { userId, animeId, dto },
      ),
    );
  }

  public async deleteProgress(
    userId: string,
    animeId: string,
  ): Promise<unknown> {
    return lastValueFrom(
      this.animeClient.send({ cmd: 'delete-progress' }, { userId, animeId }),
    );
  }
}
