import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@ApiTags('Anime/Releases')
@Controller({
  version: '1',
  path: 'anime/releases',
})
export class ReleasesController {
  public constructor(private readonly releasesService: ReleasesService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Получить последние релизы (без эпизодов)' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 10 })
  public async getLatestReleases(@Query('count') count: number = 10) {
    const result = await this.releasesService.getLatestReleases(+count);
    return wrapApiResponse(result);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить один случайный релиз (c эпизодами)' })
  public async getRandomRelease() {
    const result = await this.releasesService.getRandomRelease(true);
    return wrapApiResponse(result);
  }

  @Get('randoms')
  @ApiOperation({ summary: 'Получить случайные релизы (без эпизодов)' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 10 })
  public async getRandomReleases(@Query('count') count: number = 10) {
    const result = await this.releasesService.getRandomReleases(+count);
    return wrapApiResponse(result);
  }

  @Get(':aliasOrId')
  @ApiOperation({
    summary: 'Получить релиз по алиасу или Shikimori ID (с эпизодами)',
  })
  @ApiParam({
    name: 'aliasOrId',
    description: 'Алиас или числовой Shikimori ID',
    example: 'naruto',
  })
  async getByAliasOrShikiId(@Param('aliasOrId') aliasOrId: string) {
    const shikimoriId = Number(aliasOrId);

    if (!isNaN(shikimoriId)) {
      const result = await this.releasesService.getByAliasOrShikiId(
        undefined,
        shikimoriId,
      );
      return wrapApiResponse(result);
    }

    const result = await this.releasesService.getByAliasOrShikiId(
      aliasOrId,
      undefined,
    );
    return wrapApiResponse(result);
  }
}
