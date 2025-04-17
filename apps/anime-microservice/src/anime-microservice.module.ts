import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { V1Module } from './versions/v1/v1.module';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    V1Module,
  ],
})
export class AnimeMicroserviceModule {}
