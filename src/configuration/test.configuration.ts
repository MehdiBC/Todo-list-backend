import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService = null) => ({
  configOptions: {
    envFilePath: 'common.env',
  },
  database: {
    type: 'sqlite' as const,
    database: 'db',
    synchronize: true,
    autoLoadEntities: true,
  },
});
