import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Authentication, Authorisation
import { AuthModule } from './authentication/auth.module';
import { AuthorisationModule } from './authorisation/authorisation.module';
// Guards, Interceptors
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './authorisation/RolesGuard';
import { JwtAuthGuard } from './authentication/guards/jwt.auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// Middlewares
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
// Configuration
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './main';
// Models
import { UserModule } from './model/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ...configuration().configOptions,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configuration(configService).database,
    }),
    UserModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLE_TTL'),
        limit: configService.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    AuthModule,
    AuthorisationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(MorganMiddleware).forRoutes('**');
    consumer.apply(HelmetMiddleware).forRoutes('**');
  }
}
