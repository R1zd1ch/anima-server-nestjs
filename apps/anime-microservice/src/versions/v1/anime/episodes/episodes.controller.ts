import { Controller, Get, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Anime/Episodes')
@Controller({
  version: '1',
  path: 'anime/episodes',
})
export class EpisodesController {
  public constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список эпизодов по alias или shikimoriId',
  })
  @ApiQuery({ name: 'alias', required: false, type: String, example: 'naruto' })
  @ApiQuery({
    name: 'shikimoriId',
    required: false,
    type: Number,
    example: 123,
  })
  getEpisodes(
    @Query('alias') alias: string,
    @Query('shikimoriId') shikimoriId: number,
  ) {
    return this.episodesService.getEpisodes(alias, +shikimoriId);
  }
}
