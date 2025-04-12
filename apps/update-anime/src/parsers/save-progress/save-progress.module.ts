import { Module } from '@nestjs/common';
import { ProgressService } from './save-progress.service';
import { ProgressController } from './save-progress.controller';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
