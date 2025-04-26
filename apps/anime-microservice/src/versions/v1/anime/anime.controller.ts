import { Controller } from '@nestjs/common';
import { AnimeService } from './anime.service';

@Controller({
  version: '1',
  path: 'anime',
})
export class AnimeController {
  public constructor(private readonly animeService: AnimeService) {}
}
