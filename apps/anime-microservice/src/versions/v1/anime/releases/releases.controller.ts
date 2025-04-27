import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

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
    return this.releasesService.getLatestReleases(+count);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить один случайный релиз (c эпизодами)' })
  public async getRandomRelease() {
    return this.releasesService.getRandomRelease(true);
  }

  @Get('randoms')
  @ApiOperation({ summary: 'Получить случайные релизы (без эпизодов)' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 10 })
  public async getRandomReleases(@Query('count') count: number = 10) {
    return this.releasesService.getRandomReleases(+count);
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
      return this.releasesService.getByAliasOrShikiId(undefined, shikimoriId);
    }

    return this.releasesService.getByAliasOrShikiId(aliasOrId, undefined);
  }
}
