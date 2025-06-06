import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { getVersionModule } from './libs/utils/get-version-module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    getVersionModule(),
  ],
})
export class UserMicroserviceModule {}
