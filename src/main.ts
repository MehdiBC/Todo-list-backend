import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Configuration variables
import devConfiguration from './configuration/dev.configuration';
import testConfiguration from './configuration/test.configuration';
import prodConfiguration from './configuration/prod.configuration';
import { ConfigService } from '@nestjs/config';

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
export const configuration = (configService: ConfigService) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return devConfiguration(configService);
    case 'staging':
      return testConfiguration(configService);
    default:
      return prodConfiguration(configService);
  }
};

bootstrap().catch((error) => console.log(error));
