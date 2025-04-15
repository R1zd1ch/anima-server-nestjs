import { Injectable } from '@nestjs/common';

@Injectable()
export class AnimeMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
