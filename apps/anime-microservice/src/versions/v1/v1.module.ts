import { Module } from '@nestjs/common';
import { CatalogModule } from './anime/catalog/catalog.module';
import { ReferencesModule } from './anime/catalog/references/references.module';
import { GenresModule } from './anime/genres/genres.module';
import { ReleasesModule } from './anime/releases/releases.module';
import { DemographicModule } from './anime/demographic/demograpghic.module';
import { ThemesModule } from './anime/themes/themes.module';
import { UserModule } from './anime/user/user.module';
import { EpisodesModule } from './anime/episodes/episodes.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      expandVariables: true,
    }),
    CatalogModule,
    ReferencesModule,
    GenresModule,
    ReleasesModule,
    DemographicModule,
    ThemesModule,
    UserModule,
    EpisodesModule,
  ],
})
export class V1Module {}
