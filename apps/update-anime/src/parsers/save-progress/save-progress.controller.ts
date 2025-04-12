import { Controller, Get, Param } from '@nestjs/common';
import { ProgressService } from './save-progress.service';

@Controller('parsers/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('status/:name')
  async getStatus(@Param('name') name: string) {
    return this.progressService.getCurrentStatus(name);
  }
}
