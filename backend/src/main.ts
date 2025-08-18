import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes start with /api
  app.setGlobalPrefix('api');

  // Alow requests from Postman or frontend
  app.enableCors();

  // Global error filter
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true}));
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('Applications is running on: http://localhost:3000/api');
}
bootstrap();
