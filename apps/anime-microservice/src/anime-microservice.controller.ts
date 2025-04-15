import { Controller, Get } from '@nestjs/common';
import { AnimeMicroserviceService } from './anime-microservice.service';

@Controller()
export class AnimeMicroserviceController {
  constructor(
    private readonly animeMicroserviceService: AnimeMicroserviceService,
  ) {}

  @Get()
  getHello(): string {
    return this.animeMicroserviceService.getHello();
  }
}
