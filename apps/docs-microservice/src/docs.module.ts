import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from 'shared/lib/utils/is-dev.util';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: !IS_DEV_ENV,
      expandVariables: true,
    }),
    HttpModule,
  ],

  providers: [SwaggerService, ConfigService],
})
export class DocsModule {}
