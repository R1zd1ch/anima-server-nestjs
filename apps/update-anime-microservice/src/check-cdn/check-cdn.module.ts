import { Module } from '@nestjs/common';
import { AnilibriaCheckService } from './anilibria-check.service';
import { KodikCheckService } from './kodik-check.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AnilibriaCheckService, KodikCheckService],
  exports: [AnilibriaCheckService, KodikCheckService],
})
export class CheckCdnModule {}
