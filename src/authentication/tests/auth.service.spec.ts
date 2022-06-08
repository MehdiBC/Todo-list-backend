import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../model/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getMockJwtService } from './__mocks__/get-mock-jwt-service';
import { getMockConfigService } from './__mocks__/get-mock-config-service';
import { getMockUserService } from './__mocks__/get-mock-user-service';
import { mockedUserLoginCredentials } from './__mocks__/mocked-user-login-credentials';
import { Role } from '../../model/user/enumerations/role.enum';
import * as bcrypt from 'bcrypt';
import { expect } from '@jest/globals';


describe('AuthService integration with UserService', () => {
  let service: AuthService;
  let mockedConfigService;
  let mockedJwtService;
  let mockedUserService;
  let userData;

  beforeEach(async () => {
    mockedJwtService = getMockJwtService();
    mockedConfigService = getMockConfigService();
    userData = { ...mockedUserLoginCredentials };
    mockedUserService = getMockUserService({ id: 1, ...userData, role: Role.USER });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('when validating a user by email and password', () => {
    describe('and email doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockedUserService.findOneByEmail = jest.fn().mockResolvedValue(null);
      });
      it('should return null', async () => {
        expect(await service.validateUser(userData.email, userData.password)).toBeNull();
      });
    });
    describe('and user with that email exists in the database', () => {
      let bcryptCompare: jest.Mock;
      describe('and wrong password', () => {
        beforeEach(async () => {
          bcryptCompare = jest.fn().mockReturnValue(false);
          (bcrypt.compare as jest.Mock) = bcryptCompare;
        });
        it('should return null', async () => {
          expect(await service.validateUser(userData.email, userData.password)).toBeNull();
        });
      });
      describe('and matched password', () => {
        beforeEach(async () => {
          bcryptCompare = jest.fn().mockReturnValue(true);
          (bcrypt.compare as jest.Mock) = bcryptCompare;
        });
        it('should return a LoginUser object', async () => {
          expect(await service.validateUser(userData.email, userData.password)).toEqual({
            id: expect.any(Number),
            email: userData.email,
          });
        });
      });
    });
  });
  describe('when logging a user by email and password', () => {
    it('should return an access token', async () => {
      expect(await service.login(userData)).toEqual({ accessToken: expect.any(String) });
    });
  });
  describe('when signing up a user', () => {
    it('should return an access token', async () => {
      expect(await service.login(userData)).toEqual({ accessToken: expect.any(String) });
    });
  });
});
