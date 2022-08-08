import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as Sentry from '@sentry/node';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  Sentry.init({
    dsn: 'https://cd73d3a5cab0459692ed4ad04a5c488f@o326312.ingest.sentry.io/6627867',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
