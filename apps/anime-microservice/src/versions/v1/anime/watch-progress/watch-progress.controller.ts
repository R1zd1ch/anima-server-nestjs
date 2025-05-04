import { Controller } from '@nestjs/common';
import { WatchProgressService } from './watch-progress.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressCreateDto } from './dto/create-progress.dto';
import { ProgressUpdateDto } from './dto/response-progress.dto';

@Controller({
  version: '1',
  path: 'anime/user/watch-progress',
})
export class WatchProgressController {
  public constructor(
    private readonly watchProgressService: WatchProgressService,
  ) {}

  @MessagePattern({ cmd: 'create-progress' })
  public async createProgress(
    @Payload()
    data: {
      userId: string;
      animeId: string;
      dto: ProgressCreateDto;
    },
  ) {
    const { userId, animeId, dto } = data;
    return this.watchProgressService.createProgress(userId, animeId, dto);
  }

  @MessagePattern({ cmd: 'get-progress' })
  public async getProgress(
    @Payload()
    data: {
      userId: string;
      animeId: string;
    },
  ) {
    const { userId, animeId } = data;
    return this.watchProgressService.getProgress(userId, animeId);
  }

  @MessagePattern({ cmd: 'update-time-codes' })
  public async updateTimeCodes(
    @Payload()
    data: {
      userId: string;
      animeId: string;
      dto: ProgressUpdateDto;
    },
  ) {
    const { userId, animeId, dto } = data;
    return this.watchProgressService.updateTimeCodes(userId, animeId, dto);
  }

  @MessagePattern({ cmd: 'delete-progress' })
  public async deleteProgress(
    @Payload()
    data: {
      userId: string;
      animeId: string;
    },
  ) {
    const { userId, animeId } = data;
    return this.watchProgressService.deleteProgress(userId, animeId);
  }
}
