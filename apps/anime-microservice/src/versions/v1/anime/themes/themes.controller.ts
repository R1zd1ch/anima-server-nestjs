import { Controller, Get, Param, Query } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { parsePagination } from 'shared/lib/utils/parse-pagination';

@ApiTags('Anime/Themes')
@Controller({
  version: '1',
  path: 'anime/themes',
})
export class ThemesController {
  public constructor(private readonly themesService: ThemesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все темы' })
  public async getThemes() {
    const result = await this.themesService.getThemes();
    return wrapApiResponse(result);
  }

  @Get('random/:requestId')
  @ApiOperation({ summary: 'Получить случайное аниме по теме' })
  @ApiParam({ name: 'requestId', type: Number, example: 5 })
  public async getRandomAnimeFromTheme(@Param('requestId') requestId: number) {
    const result = await this.themesService.getRandomAnimeFromTheme(requestId);
    return wrapApiResponse(result);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайные темы' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 1 })
  public async getRandomTheme(@Query('count') count: number = 1) {
    const result = await this.themesService.getRandomTheme(+count);
    return wrapApiResponse(result);
  }

  @Get(':requestId')
  @ApiOperation({ summary: 'Получить тему по ID' })
  @ApiParam({ name: 'requestId', type: Number, example: 123 })
  public async getThemeById(@Param('requestId') requestId: number) {
    const result = await this.themesService.getThemeById(requestId);
    return wrapApiResponse(result);
  }

  @Get(':requestId/releases')
  @ApiOperation({ summary: 'Получить аниме по теме' })
  @ApiParam({ name: 'requestId', type: Number, example: 123 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  public async getAnimeFromTheme(
    @Param('requestId') requestId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    return this.themesService.getAnimeFromTheme(
      Number(requestId) || 1,
      pageNumber,
      limitNumber,
    );
  }
}
