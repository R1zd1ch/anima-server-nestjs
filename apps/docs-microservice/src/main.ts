// apps/docs-microservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { DocsModule } from './docs.module';
import { SwaggerService } from './swagger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(DocsModule);
  const config = app.get(ConfigService);

  const swaggerService = app.get(SwaggerService);
  await swaggerService.setup(app);

  const port = config.getOrThrow<string>('DOCS_MICROSERVICE_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
