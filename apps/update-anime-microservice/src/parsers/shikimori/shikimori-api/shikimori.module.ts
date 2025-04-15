import { Module } from '@nestjs/common';
import { ShikimoriService } from './shikimori.service';
import { HttpModule } from '@nestjs/axios';
import { TestController } from './test.controller';

@Module({
  imports: [HttpModule],
  controllers: [TestController],
  providers: [ShikimoriService],
  exports: [ShikimoriService],
})
export class ShikimoriModule {}
