import { Module } from '@nestjs/common';
import { KodikService } from './kodik.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KodikService],
  exports: [KodikService, HttpModule],
})
export class KodikModule {}
