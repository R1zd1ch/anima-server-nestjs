import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateAnimeService {
  healthCheck() {
    return {
      status: 'OK',
      service: 'update-anime',
    };
  }
  getHello(): string {
    return 'Hello World!';
  }
}
