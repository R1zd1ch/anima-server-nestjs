import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { V1Module } from './versions/v1/v1.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    V1Module,
  ],
})
export class UserMicroserviceModule {}
