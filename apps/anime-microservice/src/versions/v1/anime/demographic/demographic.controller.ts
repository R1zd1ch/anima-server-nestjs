import { Controller, Get, Param, Query } from '@nestjs/common';
import { DemographicService } from './demographic.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { parsePagination } from 'shared/lib/utils/parse-pagination';

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
    const result = await this.demographicService.getDemographics();
    return wrapApiResponse(result);
  }

  @Get('random/:requestId')
  @ApiOperation({ summary: 'Получить случайное аниме по ID демографии' })
  @ApiParam({ name: 'requestId', type: Number, example: 4 })
  public async getRandomAnimeFromDemographic(
    @Param('requestId') requestId: number,
  ) {
    const result =
      await this.demographicService.getRandomAnimeFromDemographic(+requestId);
    return wrapApiResponse(result);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайные демографии' })
  @ApiQuery({ name: 'count', required: false, type: Number, example: 1 })
  public async getRandomDemographic(@Query('count') count: number = 1) {
    const result = await this.demographicService.getRandomDemographic(+count);
    return wrapApiResponse(result);
  }

  @Get(':requestId')
  @ApiOperation({ summary: 'Получить демографию по ID' })
  @ApiParam({ name: 'requestId', type: Number, example: 4 })
  public async getDemographicById(@Param('requestId') requestId: number) {
    const result = await this.demographicService.getDemographicById(+requestId);
    return wrapApiResponse(result);
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
    const { pageNumber, limitNumber } = parsePagination(page, limit);
    const result = await this.demographicService.getAnimeFromDemographic(
      Number(requestId) || 1,
      pageNumber,
      limitNumber,
    );

    return wrapApiResponse(result, true);
  }
}
