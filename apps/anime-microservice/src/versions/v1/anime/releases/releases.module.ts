import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';
import { EpisodesModule } from '../episodes/episodes.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [EpisodesModule, ReviewsModule],
  controllers: [ReleasesController],
  providers: [ReleasesService],
  exports: [],
})
export class ReleasesModule {}
