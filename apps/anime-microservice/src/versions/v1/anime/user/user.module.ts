import { Module } from '@nestjs/common';
import { WatchProgressModule } from './watch-progress/watch-progress.module';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [WatchProgressModule, CollectionsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
