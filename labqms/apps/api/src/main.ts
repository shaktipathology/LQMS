import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });
  const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax' } });
  app.use(csrfProtection);
  app.use((req: any, res: any, next: () => void) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = config.get<number>('port', 4000);
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

bootstrap();
