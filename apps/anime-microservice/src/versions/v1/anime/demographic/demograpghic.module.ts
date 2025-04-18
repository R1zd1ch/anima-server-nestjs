import { Module } from '@nestjs/common';
import { DemographicController } from './demographic.controller';
import { DemographicService } from './demographic.service';

@Module({
  controllers: [DemographicController],
  providers: [DemographicService],
  exports: [],
})
export class DemographicModule {}
