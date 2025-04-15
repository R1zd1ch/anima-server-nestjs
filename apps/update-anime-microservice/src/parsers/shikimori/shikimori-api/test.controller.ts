import { Controller, Get, Param } from '@nestjs/common';
import { ShikimoriService } from './shikimori.service';

@Controller('update-anime/test')
export class TestController {
  constructor(private readonly shikimoriService: ShikimoriService) {}

  @Get(':id')
  getAnimeById(@Param('id') id: string) {
    return this.shikimoriService.getAnimeById(id);
  }

  @Get()
  getAnimes() {
    return this.shikimoriService.getAnimeList({
      page: 1,
      limit: 50,
      order: 'id',
      kind: '',
      status: '',
    });
  }
}
