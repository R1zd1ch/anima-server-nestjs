import { Controller, Get } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParsingSessionType } from '@prisma/__generated__';

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
  async getAnimeList() {
    return this.parseShikimoriService.startInitParsing();
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
  async resumeParsing() {
    return this.parseShikimoriService.resumeInitParsing();
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
  async startUpdateOngoings() {
    return this.parseShikimoriService.startUpdateOngoings();
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
  async resumeUpdateOngoings() {
    return this.parseShikimoriService.resumeUpdateOngoings();
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
  async startUpdateThisYear() {
    return this.parseShikimoriService.startUpdateThisYear();
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
  async resumeUpdateThisYear() {
    return this.parseShikimoriService.resumeUpdateThisYear();
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
  async stopInitParsing() {
    return this.parseShikimoriService.stopParsing(
      ParsingSessionType.CREATE_DATABASE,
    );
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
  async stopUpdateOngoings() {
    return this.parseShikimoriService.stopParsing(
      ParsingSessionType.UPDATE_ONGOINGS,
    );
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
  async stopUpdateThisYear() {
    return this.parseShikimoriService.stopParsing(
      ParsingSessionType.UPDATE_THIS_YEAR,
    );
  }
}
