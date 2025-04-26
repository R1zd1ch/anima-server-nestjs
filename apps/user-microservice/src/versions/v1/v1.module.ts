import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      expandVariables: true,
    }),
  ],
})
export class V1Module {}
