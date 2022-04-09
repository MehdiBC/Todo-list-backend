import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Configuration variables
import devConfiguration from './configuration/dev.configuration';
import testConfiguration from './configuration/test.configuration';
import prodConfiguration from './configuration/prod.configuration';

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
  await app.listen(process.env.PORT ?? 3000);
}

// Configuration setup for development, production or test
export let configuration;
switch (process.env.NODE_ENV) {
  case 'development':
    configuration = devConfiguration;
    break;
  case 'test':
    configuration = testConfiguration;
    break;
  default:
    configuration = prodConfiguration;
    break;
}

bootstrap().catch((error) => console.log(error));
