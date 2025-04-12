import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TempService {
  public constructor(
    @Inject('UPDATE_ANIME') private readonly client: ClientProxy,
  ) {}

  async testMicroservice() {
    const response = await this.client
      .send<{
        status: string;
        microserviceResponse: string;
      }>({ cmd: 'update_anime' }, '')
      .toPromise();

    return response;
  }
}
