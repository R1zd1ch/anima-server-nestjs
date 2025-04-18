import { Module } from '@nestjs/common';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';

@Module({
  controllers: [ReferencesController],
  providers: [ReferencesService],
  exports: [],
})
export class ReferencesModule {}
