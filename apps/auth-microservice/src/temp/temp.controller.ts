import { Controller, Get } from '@nestjs/common';
import { TempService } from './temp.service';

@Controller('temp')
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get()
  testMicroservice() {
    return this.tempService.testMicroservice();
  }
}
