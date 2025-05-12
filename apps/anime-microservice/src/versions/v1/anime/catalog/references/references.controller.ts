import { Controller, Get } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@ApiTags('Anime/Catalog/References')
@Controller({
  version: '1',
  path: 'anime/catalog/references',
})
export class ReferencesController {
  public constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все референсы' })
  public async getRefernces() {
    const result = await this.referencesService.getRefernces();
    return wrapApiResponse(result);
  }

  @Get('genres')
  @ApiOperation({ summary: 'Получить жанры' })
  public async getGenres() {
    const result = await this.referencesService.getGenres();
    return wrapApiResponse(result);
  }

  @Get('demographics')
  @ApiOperation({ summary: 'Получить демографические категории' })
  public async getDemographics() {
    const result = await this.referencesService.getDemographics();
    return wrapApiResponse(result);
  }

  @Get('themes')
  @ApiOperation({ summary: 'Получить темы' })
  public async getThemes() {
    const result = await this.referencesService.getThemes();
    return wrapApiResponse(result);
  }

  @Get('age-ratings')
  @ApiOperation({ summary: 'Получить возрастные рейтинги' })
  public async getAgeRatings() {
    const result = await this.referencesService.getRatings();
    return wrapApiResponse(result as object);
  }

  @Get('seasons')
  @ApiOperation({ summary: 'Получить сезоны' })
  public async getSeasons() {
    const result = await this.referencesService.getSeasons();
    return wrapApiResponse(result as object);
  }

  @Get('sortings')
  @ApiOperation({ summary: 'Получить типы сортировки' })
  public async getSortings() {
    const result = await this.referencesService.getSortings();
    return wrapApiResponse(result as object);
  }

  @Get('types')
  @ApiOperation({ summary: 'Получить типы аниме' })
  public async getTypes() {
    const result = await this.referencesService.getTypes();
    return wrapApiResponse(result as object);
  }

  @Get('years')
  @ApiOperation({ summary: 'Получить годы выпуска' })
  public async getYears() {
    const result = await this.referencesService.getYears();
    return wrapApiResponse(result as object);
  }
}
