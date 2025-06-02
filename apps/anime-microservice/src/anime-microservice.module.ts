import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { PrismaModule } from 'shared/lib/prisma/prisma.module';
import { getVersionModule } from './libs/utils/get-version-module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URI');
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(redisUrl),
              namespace: 'cache',
              useKeyPrefix: false,
            }),
          ],
        };
      },
    }),
    getVersionModule(),
  ],
})
export class AnimeMicroserviceModule {}
