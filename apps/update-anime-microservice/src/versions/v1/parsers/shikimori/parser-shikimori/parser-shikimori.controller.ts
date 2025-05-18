import { Controller, Get } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
@ApiTags('Update-anime/Parsers/Shikimori')
@Controller({ version: '1', path: 'update-anime/parsers/shikimori' })
export class ParseShikimoriController {
  constructor(private readonly parseShikimoriService: ParseShikimoriService) {}

  @Get('start-init')
  @ApiOperation({
    summary: 'Запуск начальной инициализации парсинга',
    description:
      'Начинает процесс инициализации парсинга для получения списка аниме.',
  })
  @ApiResponse({
    status: 200,
    description: 'Парсинг начальной инициализации успешно запущен.',
  })
  public async getAnimeList() {
    const result =
      await this.parseShikimoriService.handleAction('startInitParsing');
    return wrapApiResponse(result);
  }

  @Get('resume-init')
  @ApiOperation({
    summary: 'Возобновить начальную инициализацию парсинга',
    description: 'Возобновляет процесс начальной инициализации парсинга.',
  })
  @ApiResponse({
    status: 200,
    description: 'Парсинг начальной инициализации успешно возобновлен.',
  })
  public async resumeParsing() {
    const result =
      await this.parseShikimoriService.handleAction('resumeInitParsing');
    return wrapApiResponse(result);
  }

  @Get('start-update-ongoings')
  @ApiOperation({
    summary: 'Запуск обновления для продолжающихся аниме',
    description:
      'Запускает процесс обновления данных для продолжающихся аниме.',
  })
  @ApiResponse({
    status: 200,
    description: 'Процесс обновления для продолжающихся аниме успешно запущен.',
  })
  public async startUpdateOngoings() {
    const result = await this.parseShikimoriService.handleAction(
      'startUpdateOngoings',
    );
    return wrapApiResponse(result);
  }

  @Get('resume-update-ongoings')
  @ApiOperation({
    summary: 'Возобновить обновление для продолжающихся аниме',
    description:
      'Возобновляет процесс обновления данных для продолжающихся аниме.',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновление продолжающихся аниме успешно возобновлено.',
  })
  public async resumeUpdateOngoings() {
    const result = await this.parseShikimoriService.handleAction(
      'resumeUpdateOngoings',
    );
    return wrapApiResponse(result);
  }

  @Get('start-update-this-year')
  @ApiOperation({
    summary: 'Запуск обновления для аниме текущего года',
    description: 'Запускает процесс обновления данных для аниме текущего года.',
  })
  @ApiResponse({
    status: 200,
    description: 'Процесс обновления аниме текущего года успешно запущен.',
  })
  public async startUpdateThisYear() {
    const result = await this.parseShikimoriService.handleAction(
      'startUpdateThisYear',
    );
    return wrapApiResponse(result);
  }

  @Get('resume-update-this-year')
  @ApiOperation({
    summary: 'Возобновить обновление для аниме текущего года',
    description:
      'Возобновляет процесс обновления данных для аниме текущего года.',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновление аниме текущего года успешно возобновлено.',
  })
  public async resumeUpdateThisYear() {
    const result = await this.parseShikimoriService.handleAction(
      'resumeUpdateThisYear',
    );
    return wrapApiResponse(result);
  }

  @Get('stop-init')
  @ApiOperation({
    summary: 'Остановить начальную инициализацию парсинга',
    description: 'Принудительно останавливает процесс начальной инициализации.',
  })
  @ApiResponse({
    status: 200,
    description: 'Парсинг начальной инициализации успешно остановлен.',
  })
  public async stopInitParsing() {
    const result =
      await this.parseShikimoriService.handleAction('stopInitParsing');
    return wrapApiResponse(result);
  }

  @Get('stop-update-ongoings')
  @ApiOperation({
    summary: 'Остановить обновление онгоингов',
    description: 'Принудительно останавливает процесс обновления онгоингов.',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновление онгоингов успешно остановлено.',
  })
  public async stopUpdateOngoings() {
    const result =
      await this.parseShikimoriService.handleAction('stopUpdateOngoings');
    return wrapApiResponse(result);
  }

  @Get('stop-update-this-year')
  @ApiOperation({
    summary: 'Остановить обновление аниме текущего года',
    description:
      'Принудительно останавливает процесс обновления текущего года.',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновление аниме текущего года успешно остановлено.',
  })
  public async stopUpdateThisYear() {
    const result =
      await this.parseShikimoriService.handleAction('stopUpdateThisYear');
    return wrapApiResponse(result);
  }
}
