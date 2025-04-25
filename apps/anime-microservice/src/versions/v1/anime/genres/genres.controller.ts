import { Controller, Get, Param, Query } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller({
  version: '1',
  path: 'anime/genres',
})
export class GenresController {
  public constructor(private readonly genresService: GenresService) {}

  @Get()
  public async getGenres() {
    return this.genresService.getGenres();
  }
  @Get('random')
  public async getRandomGenre(@Query('count') count: number = 1) {
    return this.genresService.getRandomGenre(+count);
  }

  @Get(':requestId')
  public async getGenreById(@Param('requestId') requestId: number) {
    return this.genresService.getGenreById(+requestId);
  }

  @Get(':requestId/releases')
  public async getAnimeFromGenre(
    @Param('requestId') requestId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.genresService.getAnimeFromGenre(
      +requestId,
      +page || 1,
      +limit || 1,
    );
  }
}
