import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable validation globally with automatic DTO type conversion and whitelist filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Auto-converts numbers, booleans from query parameters
      },
    }),
  );

  // Enable CORS for React frontend integration
  app.enableCors({
    origin: true, // Allow all origins for development, adjust for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend de Ciudadela MIA ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();
