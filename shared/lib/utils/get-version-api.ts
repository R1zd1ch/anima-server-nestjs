import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const getVersionApi = (configService: ConfigService) =>
  configService.getOrThrow<string>('API_VERSION');

export const getVersionApiEnv = () => process.env.API_VERSION;
