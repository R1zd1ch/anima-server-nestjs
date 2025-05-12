import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ReleasesParamsDto } from './dtos/releases-params.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@ApiTags('Anime/Catalog')
@Controller({ version: '1', path: 'anime/catalog' })
export class CatalogController {
  public constructor(private readonly catalogService: CatalogService) {}

  @Get('releases')
  @ApiOperation({ summary: 'Получить список релизов по фильтрам' })
  @ApiQuery({ name: 'params', type: ReleasesParamsDto })
  public async getReleases(@Query() params: ReleasesParamsDto) {
    const result = await this.catalogService.getReleases(params);
    return wrapApiResponse(result, true);
  }

  @Get('release')
  @ApiOperation({
    summary: 'Получить релиз по ID или Shikimori ID с эпизодами',
  })
  @ApiQuery({ name: 'id', required: false, type: String, example: '5114' })
  @ApiQuery({
    name: 'shikimoriId',
    required: false,
    type: String,
    example: '5114',
  })
  public async getRelease(
    @Query('id') id?: string,
    @Query('shikimoriId') shikimoriId?: string,
  ) {
    const result = await this.catalogService.getRelease(id, shikimoriId);
    return wrapApiResponse(result);
  }
}
