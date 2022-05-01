import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UserModule } from '../../model/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite' as const,
          database: 'db',
          synchronize: true,
          autoLoadEntities: true,
        }),
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: 'GrIzet12',
          signOptions: {
            expiresIn: '30d',
          },
        }),
      ],
      providers: [LocalStrategy, AuthService],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });
});
