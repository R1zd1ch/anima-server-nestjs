import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ParseShikimoriModule } from './v1/parsers/shikimori/parser-shikimori/parser-shikimori.module';
import { UpdateDbModule } from './v1/update-db/update-db.module';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { ShikimoriModule } from './v1/parsers/shikimori/shikimori-api/shikimori.module';
import { ProgressModule } from './v1/parsers/progress/progress.module';
import { UpdateJobsModule } from './v1/update-jobs/update-jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    ParseShikimoriModule,
    UpdateDbModule,
    PrismaModule,
    ShikimoriModule,
    ProgressModule,
    UpdateJobsModule,
  ],
})
export class V1Module {}
