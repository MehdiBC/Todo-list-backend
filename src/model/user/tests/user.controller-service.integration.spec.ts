import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { mockedUser } from './__mocks__/mocked-user';
import { getMockUserRepository } from './__mocks__/get-mock-user-repository';
import { DatabaseConstraint } from '../../database.constraint';
import { expect } from '@jest/globals';

describe('UserController integration with UserService', () => {
  let app: INestApplication;
  const apiClient = () => supertest(app.getHttpServer());
  let controller: UserController;
  let mockUserRepository;
  let userData;

  beforeEach(async () => {
    userData = { ...mockedUser };
    mockUserRepository = getMockUserRepository(userData);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when getting all users', () => {
    it('should have status 200', async () => {
      await apiClient().get('/users').expect(200);
    });
    it('should find all users', async () => {
      expect((await apiClient().get('/users')).body).toEqual([{ id: 1, ...userData }]);
    });
  });

  describe('when getting user by id', () => {
    describe('and user id exists in the database', () => {
      it('should have status 200', async () => {
        await apiClient().get('/users/1').expect(200);
      });
      it('should find a user with that id', async () => {
        expect((await apiClient().get('/users/1')).body).toEqual({ id: 1, ...userData });
      });
    });
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      });
      it('should have status 404', async () => {
        await apiClient().get('/users/1').expect(404);
      });
      it('should return a not found error with the specific message', async () => {
        expect((await apiClient().get('/users/1')).body?.message).toEqual(`User with id=1 does not exist`);
      });
    });
  });

  describe('when updating a user by id', () => {
    describe('and user id doesn\'t exist', () => {
      beforeEach(() => {
        mockUserRepository.preload = jest.fn().mockResolvedValue(null);
      });
      it('should have status 400', async () => {
        await apiClient().patch('/users/1').send(userData).expect(400);
      });
      it('should return a bad request exception with a specific message', async () => {
        expect((await apiClient().patch('/users/1').send(userData)).body?.message).toEqual(`User with id: 1 doesn't exist.`);
      });
    });
    describe('and an other user has the email to update with', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT };
        mockUserRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should have status 409', async () => {
        await apiClient().patch('/users/1').send(userData).expect(409);
      });
      it('should return a conflict error with the specific message', async () => {
        expect((await apiClient().patch('/users/1').send(userData)).body?.message).toEqual(`An other user with email: ${userData.email} exists.`);
      });
    });
    describe('and the user email is not updated or the email to update with doesn\'t exist in the database', () => {

      it('should update the user', async function() {
        expect((await apiClient().patch('/users/1').send(userData)).body).toEqual({ id: 1, ...userData });
      });
    });
  });

  describe('when removing a user by id', () => {
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockUserRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
      });
      it('should have status 400', async () => {
        await apiClient().delete('/users/1').expect(400);
      });
      it('should return a not found error with the specific message', async () => {
        expect((await apiClient().delete('/users/1')).body?.message).toEqual(`User with id: 1 doesn't exist.`);
      });
    });
    describe('and user id exists in the database', () => {
      it('should have status 200', async () => {
        await apiClient().delete('/users/1').expect(200);
      });
      it('should delete a user', async () => {
        expect((await apiClient().delete('/users/1')).body?.affected).toEqual(1);
      });
    });
  });
});
