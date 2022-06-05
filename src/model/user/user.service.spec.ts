import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Role } from './enumerations/role.enum';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseConstraint } from '../database.constraint';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userDto;
  let mockUserRepository;

  beforeEach(async () => {
    userDto = {
      email: faker.internet.email(),
      password: faker.internet.password(8),
      role: Role.USER,
    };

    mockUserRepository = {
      create: jest.fn().mockReturnValue(userDto as User),
      save: jest.fn().mockResolvedValue({ id: 1, ...userDto } as User),
      findOne: jest.fn().mockResolvedValue({ id: 1, ...userDto } as User),
      find: jest.fn().mockResolvedValue([{ id: 1, ...userDto }] as User[]),
      preload: jest.fn().mockResolvedValue([{ id: 1, ...userDto }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a user', () => {
    describe('and the user email doesn\'t exist in the database', () => {
      it('should create a new user', async function() {
        expect(await service.create(userDto)).toEqual({ id: 1, ...userDto });
      });
    });
    describe('and the user email exists in the database', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT };
        mockUserRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should throw a conflict exception', async function() {
        try {
          await service.create(userDto);
        } catch (e) {
          expect(e).toEqual(new ConflictException(`User with email: ${userDto.email} already exists.`));
        }
      });
    });
  });

  describe('when updating a user', () => {
    describe('and the user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.preload = jest.fn().mockRejectedValue(new Error());
      });
      it('should throw a bad request exception', async function() {
        try {
          await service.update(1, userDto);
        } catch (e) {
          expect(e).toEqual(new BadRequestException(`User with id: 1 doesn't exist.`));
        }
      });
    });
    describe('and the user email is not updated', () => {
    });
    describe('and the user email doesn\'t exist in the database', () => {
      it('should create a new user', async function() {
        expect(await service.create(userDto)).toEqual({ id: 1, ...userDto });
      });
    });
    describe('and the user email exists in the database', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT };
        mockUserRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should throw a conflict exception', async function() {
        try {
          await service.create(userDto);
        } catch (e) {
          expect(e).toEqual(new ConflictException(`User with email: ${userDto.email} already exists.`));
        }
      });
    });
  });

  describe('when getting all users', () => {
    it('should find all users', async function() {
      expect(await service.findAll()).toEqual([{ id: 1, ...userDto }]);
    });
  });

  describe('when getting a user by id', () => {
    describe('and the user exists in the database', () => {
      it('should find a user with that id', async function() {
        expect(await service.findOne(1)).toEqual({ id: 1, ...userDto });
      });
    });
    describe('and the user doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      });
      it('should return null', async function() {
        expect(await service.findOne(1)).toEqual(null);
      });
    });
  });

  describe('when getting a user by email', () => {
    describe('and the user exists in the database', () => {
      it('should find a user by email if exists', async function() {
        // mockUserRepository.findOne = jest.fn().mockResolvedValue({ id: 1, ...userDto });
        expect(await service.findOneByEmail(userDto.email)).toEqual({ id: 1, ...userDto });
      });
    });
    describe('and the user doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      });
      it('should return null', async function() {
        expect(await service.findOneByEmail(userDto.email)).toEqual(null);
      });
    });
  });
});
