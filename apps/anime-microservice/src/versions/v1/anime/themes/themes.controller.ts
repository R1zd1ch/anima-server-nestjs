import { Controller, Get, Param, Query } from '@nestjs/common';
import { ThemesService } from './themes.service';

@Controller({
  version: '1',
  path: 'anime/themes',
})
export class ThemesController {
  public constructor(private readonly themesService: ThemesService) {}

  @Get()
  public async getThemes() {
    return this.themesService.getThemes();
  }

  @Get('random')
  public async getRandomTheme(@Query('count') count: number = 1) {
    return this.themesService.getRandomTheme(+count);
  }

  @Get(':requestId')
  public async getThemeById(@Param('requestId') requestId: number) {
    return this.themesService.getThemeById(requestId);
  }

  @Get(':requestId/releases')
  public async getAnimeFromTheme(
    @Param('requestId') requestId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.themesService.getAnimeFromTheme(
      +requestId,
      +page || 1,
      +limit || 1,
    );
  }
}
