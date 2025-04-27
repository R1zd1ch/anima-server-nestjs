import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  imports: [EpisodesModule],
  controllers: [ThemesController],
  providers: [ThemesService],
  exports: [],
})
export class ThemesModule {}
