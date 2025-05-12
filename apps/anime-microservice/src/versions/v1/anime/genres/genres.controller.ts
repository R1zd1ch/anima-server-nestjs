import { Controller, Get, Param, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { parsePagination } from 'shared/lib/utils/parse-pagination';

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
    const result = await this.genresService.getGenres();
    return wrapApiResponse(result);
  }
  @Get('random/:requestId')
  @ApiOperation({ summary: 'Получить случайный релиз по жанру' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  public async getRandomAnimeFromGenre(@Param('requestId') requestId: number) {
    const result = await this.genresService.getRandomAnimeFromGenre(+requestId);
    return wrapApiResponse(result);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайный жанр (или несколько)' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 1 })
  public async getRandomGenre(@Query('count') count: number = 1) {
    const result = await this.genresService.getRandomGenre(+count);
    return wrapApiResponse(result);
  }

  @Get(':requestId')
  @ApiOperation({ summary: 'Получить жанр по ID' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  public async getGenreById(@Param('requestId') requestId: number) {
    const result = await this.genresService.getGenreById(+requestId);
    return wrapApiResponse(result);
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
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    return this.genresService.getAnimeFromGenre(
      Number(requestId) | 1,
      pageNumber,
      limitNumber,
    );
  }
}
