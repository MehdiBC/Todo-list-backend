import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseConstraint } from '../../database.constraint';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { mockedUser } from './__mocks__/mocked-user';
import { getMockUserRepository } from './__mocks__/get-mock-user-repository';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository;
  let userData;

  beforeEach(async () => {
    userData = { ...mockedUser };
    mockUserRepository = getMockUserRepository(userData);

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
        expect(await service.create(userData)).toEqual({ id: 1, ...userData });
      });
    });
    describe('and the user email exists in the database', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT };
        mockUserRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should throw a conflict exception', async function() {
        try {
          await service.create(userData);
        } catch (e) {
          expect(e).toEqual(new ConflictException(`User with email: ${userData.email} already exists.`));
        }
      });
    });
  });

  describe('when updating a user', () => {
    describe('and the user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.preload = jest.fn().mockResolvedValue(null);
      });
      it('should throw a bad request exception', async function() {
        try {
          await service.update(1, userData);
        } catch (e) {
          expect(e).toEqual(new BadRequestException(`User with id: 1 doesn't exist.`));
        }
      });
    });
    describe('and an other user has the email to update with', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT };
        mockUserRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should throw a conflict exception', async function() {
        try {
          await service.update(1, userData);
        } catch (e) {
          expect(e).toEqual(new ConflictException(`An other user with email: ${userData.email} exists.`));
        }
      });
    });
    describe('and the user email is not updated or the email to update with doesn\'t exist in the database', () => {
      it('should update the user', async function() {
        expect(await service.update(1, userData)).toEqual({ id: 1, ...userData });
      });
    });
  });

  describe('when getting all users', () => {
    it('should find all users', async function() {
      expect(await service.findAll()).toEqual([{ id: 1, ...userData }]);
    });
  });

  describe('when getting a user by id', () => {
    describe('and the user exists in the database', () => {
      it('should find a user with that id', async function() {
        expect(await service.findOne(1)).toEqual({ id: 1, ...userData });
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
        expect(await service.findOneByEmail(userData.email)).toEqual({ id: 1, ...userData });
      });
    });
    describe('and the user doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      });
      it('should return null', async function() {
        expect(await service.findOneByEmail(userData.email)).toEqual(null);
      });
    });
  });

  describe('when removing a user by id', () => {
    describe('and the user id exists in the database', () => {
      it('should remove exactly one user', async function() {
        expect(await service.remove(1)).toMatchObject({ affected: 1 });
      });
    });
    describe('and the user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
      });
      it('should throw a bad request exception', async function() {
        try {
          await service.remove(1);
        } catch (e) {
          expect(e).toEqual(new BadRequestException(`User with id: 1 doesn't exist.`));
        }
      });
    });
  });
});
