import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const CorsOptions = {
    origin: [process.env.CORS_URL],
  };
  app.enableCors(CorsOptions);
  await app.listen(3000);
}

bootstrap();
