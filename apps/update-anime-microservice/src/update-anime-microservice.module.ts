import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { V1Module } from './versions/v1.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    V1Module,
    // getVersionModule(), // получаем версию апи
  ],
})
export class UpdateAnimeMicroserviceModule {}
