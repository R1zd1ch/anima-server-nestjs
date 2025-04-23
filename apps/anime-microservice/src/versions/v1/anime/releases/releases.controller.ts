import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller({
  version: '1',
  path: 'anime/releases',
})
export class ReleasesController {
  public constructor(private readonly releasesService: ReleasesService) {}
  2;
  @Get('latest')
  public async getLatestReleases(@Query('count') count: number = 10) {
    return this.releasesService.getLatestReleases(+count);
  }

  @MessagePattern({ cmd: 'getLatestReleases', version: '1', action: 'get' })
  public async getLatestReleasesRabbitMQ(@Query('count') count: number = 10) {
    return this.releasesService.getLatestReleases(+count);
  }

  @Get('random')
  public async getRandomRelease() {
    return this.releasesService.getRandomRelease();
  }

  @Get('randoms')
  public async getRandomReleases(@Query('count') count: number = 10) {
    return this.releasesService.getRandomReleases(+count);
  }
  // todo rename
  @Get(':aliasOrId')
  async getByAliasOrShikiId(@Param('aliasOrId') aliasOrId: string) {
    const shikimoriId = Number(aliasOrId);

    if (!isNaN(shikimoriId)) {
      return this.releasesService.getByAliasOrShikiId(undefined, shikimoriId);
    }

    console.log(aliasOrId);

    return this.releasesService.getByAliasOrShikiId(aliasOrId, undefined);
  }
}
