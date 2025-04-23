import { Module } from '@nestjs/common';
import { CollectionsModule } from './collection/collection.module';
import { WatchProgressModule } from './watch-progress/watch-progress.module';

@Module({
  imports: [CollectionsModule, WatchProgressModule],
})
export class AnimeModule {}
