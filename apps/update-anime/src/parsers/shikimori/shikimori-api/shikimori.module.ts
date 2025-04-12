import { Module } from '@nestjs/common';
import { ShikimoriService } from './shikimori.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ShikimoriService],
  exports: [ShikimoriService],
})
export class ShikimoriModule {}
