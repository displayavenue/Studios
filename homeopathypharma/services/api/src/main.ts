import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { GlobalValidationPipe } from './common/pipes/validation.pipe.js';
import { StructuredLogger } from './observability/structured-logger.service.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  const logger = app.get(StructuredLogger);

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(GlobalValidationPipe);

  const port = process.env.API_PORT ?? process.env.PORT ?? 3001;
  await app.listen(port);

  logger.info('API listening', { port, prefix: '/v1' });
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
