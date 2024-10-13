import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for your application
  app.enableCors({
    origin:
      configService.get<string>('FRONTEND_URL') || 'http://localhost:4000',
    credentials: true, // Support sending session cookies with requests
  });

  // Use session middleware
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
        httpOnly: true, // Cookie is not accessible via JavaScript
        secure: configService.get<string>('NODE_ENV') === 'production', // Use secure cookies in production
      },
    }),
  );

  // Use global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform input to the expected data types
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Session-based Authentication API')
    .setDescription(
      'API documentation for the NestJS app with session-based authentication',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Get the port from environment variables
  const port = configService.get<number>('PORT') || 3000;

  // Log the port and environment
  logger.log(
    `Starting application in ${configService.get<string>('NODE_ENV')} mode...`,
  );
  logger.log(`Listening on http://localhost:${port}`);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
