import { Controller, Get } from '@nestjs/common';
import { TempService } from './temp.service';

@Controller({ path: 'temp', version: '1' })
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get()
  testMicroservice() {
    return this.tempService.testMicroservice();
  }
}
