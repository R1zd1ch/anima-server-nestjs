import { Controller, Get, Param, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Anime/Genres')
@Controller({
  version: '1',
  path: 'anime/genres',
})
export class GenresController {
  public constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список жанров' })
  public async getGenres() {
    return this.genresService.getGenres();
  }
  @Get('random/:requestId')
  @ApiOperation({ summary: 'Получить случайный релиз по жанру' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  public async getRandomAnimeFromGenre(@Param('requestId') requestId: number) {
    return this.genresService.getRandomAnimeFromGenre(+requestId);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайный жанр (или несколько)' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 1 })
  public async getRandomGenre(@Query('count') count: number = 1) {
    return this.genresService.getRandomGenre(+count);
  }

  @Get(':requestId')
  @ApiOperation({ summary: 'Получить жанр по ID' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  public async getGenreById(@Param('requestId') requestId: number) {
    return this.genresService.getGenreById(+requestId);
  }

  @Get(':requestId/releases')
  @ApiOperation({ summary: 'Получить релизы по жанру' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
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
