import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  imports: [EpisodesModule],
  controllers: [ReleasesController],
  providers: [ReleasesService],
  exports: [],
})
export class ReleasesModule {}
