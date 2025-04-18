import { Controller, Get } from '@nestjs/common';
import { ReferencesService } from './references.service';

@Controller({
  version: '1',
  path: 'anime/catalog/references',
})
export class ReferencesController {
  public constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  public getRefernces() {
    return this.referencesService.getRefernces();
  }

  @Get('genres')
  public getGenres() {
    return this.referencesService.getGenres();
  }

  @Get('demographics')
  public getDemographics() {
    return this.referencesService.getDemographics();
  }

  @Get('themes')
  public getThemes() {
    return this.referencesService.getThemes();
  }

  @Get('age-ratings')
  public getAgeRatings() {
    return this.referencesService.getRatings();
  }

  @Get('seasons')
  public getSeasons() {
    return this.referencesService.getSeasons();
  }

  @Get('sortings')
  public getSortings() {
    return this.referencesService.getSortings();
  }

  @Get('types')
  public getTypes() {
    return this.referencesService.getTypes();
  }

  @Get('years')
  public getYears() {
    return this.referencesService.getYears();
  }
}
