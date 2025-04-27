import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { getVersionModule } from './lib/utils/get-version-module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    getVersionModule(),
  ],
})
export class UpdateAnimeMicroserviceModule {}
