import { Module } from '@nestjs/common';
import { AnimeMicroserviceController } from './anime-microservice.controller';
import { AnimeMicroserviceService } from './anime-microservice.service';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
    }),
  ],
  controllers: [AnimeMicroserviceController],
  providers: [AnimeMicroserviceService],
})
export class AnimeMicroserviceModule {}
