import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Protect headers with helmet
  app.use(helmet());

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

  // Enable CORS with dynamic/configurable origins for frontend integration
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = frontendUrl ? frontendUrl.split(',') : true;
  
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend de Ciudadela MIA ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();
