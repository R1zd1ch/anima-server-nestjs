import { Controller, Get, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';

@Controller({
  version: '1',
  path: 'anime/episodes',
})
export class EpisodesController {
  public constructor(private readonly episodesService: EpisodesService) {}
  @Get()
  getEpisodes(
    @Query('alias') alias: string,
    @Query('shikimoriId') shikimoriId: number,
  ) {
    return this.episodesService.getEpisodes(alias, +shikimoriId);
  }
}
