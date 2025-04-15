import { Controller, Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('update-anime/parsers/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('status/:name')
  async getStatus(@Param('name') name: string) {
    return this.progressService.getCurrentStatus(name);
  }
}
