import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => ({
  database: {
    type: 'postgres' as const,
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
  },
});
