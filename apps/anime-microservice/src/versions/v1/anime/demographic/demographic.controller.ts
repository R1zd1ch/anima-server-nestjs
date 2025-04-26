import { Controller, Get, Param, Query } from '@nestjs/common';
import { DemographicService } from './demographic.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Anime/Demographic')
@Controller({
  version: '1',
  path: 'anime/demographic',
})
export class DemographicController {
  public constructor(private readonly demographicService: DemographicService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список демографий' })
  public async getDemographics() {
    return this.demographicService.getDemographics();
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайные демографии' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 1 })
  public async getRandomDemographic(@Query('count') count: number = 1) {
    return this.demographicService.getRandomDemographic(+count);
  }

  @Get(':requestId')
  @ApiOperation({ summary: 'Получить демографию по ID' })
  @ApiParam({ name: 'requestId', type: Number, example: 4 })
  public async getDemographicById(@Param('requestId') requestId: number) {
    return this.demographicService.getDemographicById(+requestId);
  }

  @Get(':requestId/releases')
  @ApiOperation({ summary: 'Получить аниме по ID демографии' })
  @ApiParam({ name: 'requestId', type: Number, example: 4 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
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
