import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  imports: [EpisodesModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
