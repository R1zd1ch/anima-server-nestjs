import { Controller, Get } from '@nestjs/common';
import { UpdateAnimeService } from './main.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('update-anime')
export class UpdateAnimeController {
  constructor(private readonly updateAnimeService: UpdateAnimeService) {}

  @Get('health-check')
  healthCheck() {
    return this.updateAnimeService.healthCheck();
  }

  @MessagePattern({ cmd: 'update_anime' })
  updateAnime() {
    return {
      status: 'OK',
      microserviceResponse: 'update_anime',
    };
  }
}
