import { Controller, Get } from '@nestjs/common';
import { ParseShikimoriService } from './parser-shikimori.service';

@Controller('update-anime/parsers/shikimori')
export class ParseShikimoriController {
  constructor(private readonly parseShikimoriService: ParseShikimoriService) {}

  @Get('start-init')
  async getAnimeList() {
    return this.parseShikimoriService.startInitParsing();
  }

  @Get('resume-init')
  async resumeParsing() {
    return this.parseShikimoriService.resumeInitParsing();
  }

  @Get('start-update-ongoings')
  async startUpdateOngoings() {
    return this.parseShikimoriService.startUpdateOngoings();
  }

  @Get('resume-update-ongoings')
  async resumeUpdateOngoings() {
    return this.parseShikimoriService.resumeUpdateOngoings();
  }

  @Get('start-update-this-year')
  async startUpdateThisYear() {
    return this.parseShikimoriService.startUpdateThisYear();
  }

  @Get('resume-update-this-year')
  async resumeUpdateThisYear() {
    return this.parseShikimoriService.resumeUpdateThisYear();
  }
}
