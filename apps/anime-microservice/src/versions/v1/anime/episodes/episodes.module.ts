import { Module } from '@nestjs/common';
import { KodikModule } from './kodik/kodik.module';
import { AnilibriaModule } from './anilibria/anilibria.module';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';

@Module({
  providers: [EpisodesService],
  controllers: [EpisodesController],
  imports: [KodikModule, AnilibriaModule],
})
export class EpisodesModule {}
