import { Controller, Get, Param, Query } from '@nestjs/common';
import { DemographicService } from './demographic.service';

@Controller({
  version: '1',
  path: 'anime/demographic',
})
export class DemographicController {
  public constructor(private readonly demographicService: DemographicService) {}

  @Get()
  public async getDemographics() {
    return this.demographicService.getDemographics();
  }

  @Get('random')
  public async getRandomDemographic(@Query('count') count: number = 1) {
    return this.demographicService.getRandomDemographic(+count);
  }

  @Get(':requestId')
  public async getDemographicById(@Param('requestId') requestId: number) {
    return this.demographicService.getDemographicById(+requestId);
  }

  @Get(':requestId/releases')
  public async getAnimeFromDemographic(
    @Param('requestId') requestId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.demographicService.getAnimeFromDemographic(
      +requestId,
      +page || 1,
      +limit || 1,
    );
  }
}
