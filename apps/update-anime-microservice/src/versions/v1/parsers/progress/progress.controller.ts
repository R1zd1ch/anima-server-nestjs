import { Controller, Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@ApiTags('Update-anime/Parsers/Progress')
@Controller({ version: '1', path: 'update-anime/parsers/progress' })
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('status/:name')
  @ApiOperation({
    summary: 'Получить текущий статус парсинга по имени',
    description: 'Возвращает текущий статус парсинга для указанного имени.',
  })
  @ApiParam({
    name: 'name',
    description: 'Имя парсинга, для которого нужно получить текущий статус.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает текущий статус парсинга.',
  })
  @ApiResponse({
    status: 404,
    description: 'Парсинг с указанным именем не найден.',
  })
  public async getStatus(@Param('name') name: string) {
    const result = await this.progressService.getCurrentStatus(name);
    return wrapApiResponse(result);
  }
}
