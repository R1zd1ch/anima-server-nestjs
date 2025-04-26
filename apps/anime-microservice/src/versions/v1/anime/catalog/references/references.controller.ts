import { Controller, Get } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Anime/Catalog/References')
@Controller({
  version: '1',
  path: 'anime/catalog/references',
})
export class ReferencesController {
  public constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все референсы' })
  public getRefernces() {
    return this.referencesService.getRefernces();
  }

  @Get('genres')
  @ApiOperation({ summary: 'Получить жанры' })
  public getGenres() {
    return this.referencesService.getGenres();
  }

  @Get('demographics')
  @ApiOperation({ summary: 'Получить демографические категории' })
  public getDemographics() {
    return this.referencesService.getDemographics();
  }

  @Get('themes')
  @ApiOperation({ summary: 'Получить темы' })
  public getThemes() {
    return this.referencesService.getThemes();
  }

  @Get('age-ratings')
  @ApiOperation({ summary: 'Получить возрастные рейтинги' })
  public getAgeRatings() {
    return this.referencesService.getRatings();
  }

  @Get('seasons')
  @ApiOperation({ summary: 'Получить сезоны' })
  public getSeasons() {
    return this.referencesService.getSeasons();
  }

  @Get('sortings')
  @ApiOperation({ summary: 'Получить типы сортировки' })
  public getSortings() {
    return this.referencesService.getSortings();
  }

  @Get('types')
  @ApiOperation({ summary: 'Получить типы аниме' })
  public getTypes() {
    return this.referencesService.getTypes();
  }

  @Get('years')
  @ApiOperation({ summary: 'Получить годы выпуска' })
  public getYears() {
    return this.referencesService.getYears();
  }
}
