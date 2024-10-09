import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret', // Use environment variables in production
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  await app.listen(3000);
}
bootstrap();
