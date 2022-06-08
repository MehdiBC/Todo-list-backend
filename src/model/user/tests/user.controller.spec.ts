import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getMockUserService } from '../../../authentication/tests/__mocks__/get-mock-user-service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { mockedUser } from './__mocks__/mocked-user';

describe('UserController', () => {
  let controller: UserController;
  let userData;
  let mockedUserService;

  beforeEach(async () => {
    userData = { ...mockedUser };
    mockedUserService = getMockUserService(userData);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('when getting all users', () => {
    it('should find all users', async () => {
      expect((await controller.findAll())).equal([{ id: 1, ...userData }]);
    });
  });

  describe('when getting user by id', () => {
    describe('and user id exists in the database', () => {
      it('should find a user with that id', async () => {
        expect(await controller.findOne(1)).equal({ id: 1, ...userData });
      });
    });
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockedUserService.findOne = jest.fn().mockResolvedValue(null);
      });
      it('should return a not found exception with the specific message', async () => {
        try {
          await controller.findOne(1);
        } catch (error) {
          expect(error).equal(new NotFoundException(`User with id=1 does not exist`));
        }
      });
    });
  });

  describe('when updating a user by id', () => {
    describe('and user id doesn\'t exist', () => {
      beforeEach(() => {
        mockedUserService.update = jest.fn().mockRejectedValue(new NotFoundException(`User with id=1 does not exist`));
      });
      it('should return a bad request exception with a specific message', async () => {
        try {
          await controller.update(1, userData);
        } catch (error) {
          expect(error).equal(new NotFoundException(`User with id=1 does not exist`));
        }
      });
    });
    describe('and an other user has the email to update with', () => {
      beforeEach(() => {
        mockedUserService.update = jest.fn().mockRejectedValue(new ConflictException(`An other user with email: ${userData.email} exists.`));
      });
      it('should return a conflict error with the specific message', async () => {
        try {
          await controller.update(1, userData);
        } catch (error) {
          expect(error).equal(new ConflictException(`An other user with email: ${userData.email} exists.`));
        }
      });
    });
    describe('and the user email is not updated or the email to update with doesn\'t exist in the database', () => {
      it('should update the user', async function() {
        expect(await controller.update(1, userData)).equal({ id: 1, ...userData });
      });
    });
  });

  describe('when removing a user by id', () => {
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockedUserService.remove = jest.fn().mockRejectedValue(new NotFoundException(`User with id=1 does not exist`));
      });
      it('should return a not found error with the specific message', async () => {
        try {
          await controller.remove(1);
        } catch (error) {
          expect(error).equal(new NotFoundException(`User with id=1 does not exist`));
        }
      });
    });
    describe('and user id exists in the database', () => {
      it('should delete a user', async () => {
        expect((await controller.remove(1)).affected).equal(1);
      });
    });
  });
});
