import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => ({
  database: {
    type: 'postgres' as const,
    host: configService.get('DB_HOST', '127.0.0.1'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USER', 'postgres'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME', 'endorsebase'),
    synchronize: true,
    autoLoadEntities: true,
  },
});
