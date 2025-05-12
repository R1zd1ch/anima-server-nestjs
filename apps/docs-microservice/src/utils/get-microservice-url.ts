import { ConfigService } from '@nestjs/config';

function isDocker(config: ConfigService) {
  return config.getOrThrow<string>('NODE_ENV') === 'production';
}

export const getMicroserviceUrl = (
  hostKey: string,
  portKey: string,
  config: ConfigService,
) => {
  const isDockerEnv = isDocker(config);
  const isTrue = false; //временно
  const host = isTrue
    ? `${config.getOrThrow<string>(hostKey)}`
    : `${config.getOrThrow<string>('APPLICATION_HOST')}`;
  const port = config.getOrThrow<string>(portKey);
  return `http://${host}:${port}/swagger-json`;
};
