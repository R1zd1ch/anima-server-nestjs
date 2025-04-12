import { Controller, Get } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';

@Controller('parsers/shikimori')
export class ParseShikimoriController {
  constructor(private readonly parseShikimoriService: ParseShikimoriService) {}

  @Get('start')
  async getAnimeList() {
    return this.parseShikimoriService.startParsing();
  }

  @Get('resume')
  async resumeParsing() {
    return this.parseShikimoriService.resumeParsing();
  }
}
