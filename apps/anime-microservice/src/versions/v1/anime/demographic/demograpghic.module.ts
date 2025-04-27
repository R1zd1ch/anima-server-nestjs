import { Module } from '@nestjs/common';
import { DemographicController } from './demographic.controller';
import { DemographicService } from './demographic.service';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  imports: [EpisodesModule],
  controllers: [DemographicController],
  providers: [DemographicService],
  exports: [],
})
export class DemographicModule {}
