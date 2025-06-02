import { Module } from '@nestjs/common';
import { CatalogModule } from './anime/catalog/catalog.module';
import { ReferencesModule } from './anime/catalog/references/references.module';
import { GenresModule } from './anime/genres/genres.module';
import { ReleasesModule } from './anime/releases/releases.module';
import { DemographicModule } from './anime/demographic/demograpghic.module';
import { ThemesModule } from './anime/themes/themes.module';
import { EpisodesModule } from './anime/episodes/episodes.module';
import { WatchProgressModule } from './anime/watch-progress/watch-progress.module';
import { CollectionsModule } from './anime/collections/collections.module';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';
import { CommentsModule } from './anime/comments/comments.module';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      name: 'USER_SERVICE',
      queue: 'user_queue',
    }),
    WatchProgressModule,
    CollectionsModule,
    CatalogModule,
    ReferencesModule,
    GenresModule,
    ReleasesModule,
    DemographicModule,
    ThemesModule,
    CommentsModule,
    EpisodesModule,
  ],
})
export class V1Module {}
