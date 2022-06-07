import { AuthService } from '../auth.service';
import { getMockJwtService } from './__mocks__/get-mock-jwt-service';
import { getMockConfigService } from './__mocks__/get-mock-config-service';
import { getMockUserRepository } from './__mocks__/get-mock-user-repository';
import { mockedUserLoginCredentials } from './__mocks__/mocked-user-login-credentials';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../model/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../model/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../model/user/enumerations/role.enum';

let service: AuthService;
let userService: UserService;
let mockedConfigService;
let mockedJwtService;
let mockUserRepository;
let userData;

describe('AuthService integration with UserService', () => {
  beforeEach(async () => {
    mockedJwtService = getMockJwtService();
    mockedConfigService = getMockConfigService();
    userData = { ...mockedUserLoginCredentials };
    mockUserRepository = getMockUserRepository({
      id: 1,
      ...userData,
      role: Role.USER,
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(service).toBeDefined();
  });
  describe('when validating a user by email and password', () => {
    it('should attempt to get a user by email', async () => {
      const findOneByEmailSpy = jest.spyOn(userService, 'findOneByEmail');
      await service.validateUser(userData.email, userData.password);
      expect(findOneByEmailSpy).toBeCalledTimes(1);
    });
    describe('and email doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
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
  describe('when signing up a user', () => {
    it('should attempt to save the user in the database', async () => {
      const createSpy = jest.spyOn(userService, 'create');
      await service.signUp(userData);
      expect(createSpy).toBeCalledTimes(1);
    });
    it('should return an access token', async () => {
      expect(await service.login(userData)).toEqual({ accessToken: expect.any(String) });
    });
  });
});
