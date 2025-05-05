import { Module } from '@nestjs/common';
import { CollectionsController as DeprecatedCollectionsController } from './deprecated-collections.controller';
import { CollectionsService as DeprecatedCollectionsService } from './deprecated-collections.service';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
  controllers: [DeprecatedCollectionsController, CollectionsController],
  providers: [DeprecatedCollectionsService, CollectionsService],
})
export class CollectionsModule {}
