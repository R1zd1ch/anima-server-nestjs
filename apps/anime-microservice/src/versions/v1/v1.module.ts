import { Module } from '@nestjs/common';
import { CatalogModule } from './anime/catalog/catalog.module';
import { ReferencesModule } from './anime/catalog/references/references.module';
import { GenresModule } from './anime/genres/genres.module';
import { ReleasesModule } from './anime/releases/releases.module';
import { DemographicModule } from './anime/demographic/demograpghic.module';
import { ThemesModule } from './anime/themes/themes.module';
import { EpisodesModule } from './anime/episodes/episodes.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { WatchProgressModule } from './anime/watch-progress/watch-progress.module';
import { CollectionsModule } from './anime/collections/collections.module';
import { RabbitMQModule } from 'shared/lib/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      expandVariables: true,
    }),
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
    EpisodesModule,
  ],
})
export class V1Module {}
