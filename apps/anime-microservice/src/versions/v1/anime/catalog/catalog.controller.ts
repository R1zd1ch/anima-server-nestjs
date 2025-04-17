import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ReleasesParamsDto } from './dtos/releases-params.dto';

@Controller({ version: '1', path: 'anime/catalog' })
export class CatalogController {
  public constructor(private readonly catalogService: CatalogService) {}

  @Get('releases')
  async getReleases(@Query() params: ReleasesParamsDto) {
    return this.catalogService.getReleases(params);
  }

  @Get('release')
  async getRelease(
    @Query('id') id?: string,
    @Query('shikimoriId') shikimoriId?: string,
  ) {
    return this.catalogService.getRelease(id, shikimoriId);
  }
}
