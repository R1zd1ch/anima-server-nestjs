import { Module } from '@nestjs/common';
import { KodikModule } from './kodik/kodik.module';
import { AnilibriaModule } from './anilibria/anilibria.module';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { KodikService } from './kodik/kodik.service';
import { AnilibriaService } from './anilibria/anilibiria.service';

@Module({
  imports: [KodikModule, AnilibriaModule],
  providers: [EpisodesService, KodikService, AnilibriaService],
  controllers: [EpisodesController],
  exports: [EpisodesService, KodikService, AnilibriaService],
})
export class EpisodesModule {}
