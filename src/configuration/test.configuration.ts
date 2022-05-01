import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => ({
  database: {
    type: 'sqlite' as const,
    database: 'db',
    synchronize: true,
    autoLoadEntities: true,
  },
});
