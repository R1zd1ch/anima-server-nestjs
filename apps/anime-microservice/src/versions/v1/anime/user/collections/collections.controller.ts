import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CollectionsService } from './collections.service';

@Controller({
  path: 'anime/user/watch-progress',
  version: '1',
})
export class CollectionsController {
  public constructor(private readonly collectionsService: CollectionsService) {}
  @MessagePattern({ cmd: 'get-collections', version: '1', action: 'get' })
  async getCollections(@Payload() payload: { userId: string }) {
    return this.collectionsService.getCollections(payload.userId);
  }
}
