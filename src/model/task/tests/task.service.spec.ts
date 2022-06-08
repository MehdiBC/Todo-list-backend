import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { getMockTaskRepository } from './__mocks__/get-mock-task-repository';
import { mockedTaskData } from './__mocks__/mockedTaskData';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { expect } from '@jest/globals';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskRepository;
  let taskData;

  beforeEach(async () => {
    taskData = { ...mockedTaskData };
    mockTaskRepository = getMockTaskRepository(taskData);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a task', () => {
    describe('and task name exists in the database', () => {
      beforeEach(() => {
        mockTaskRepository.create = jest.fn().mockRejectedValue(new ConflictException(`Task with name: ${taskData.name} already exists.`));
      });
      it('should throw a conflict exception with specified message', async () => {
        try {
          await service.create(taskData);
        } catch (error) {
          expect(error).toEqual(new ConflictException(`An other task with name: ${taskData.name} exists.`));
        }
      });
    });
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.create = jest.fn().mockRejectedValue(new BadRequestException(`User with id: ${taskData.user.id} doesn't exist.`));
      });
      it('should throw a bad request exception with specified message', async () => {
        try {
          await service.create(taskData);
        } catch (error) {
          expect(error).toEqual(new BadRequestException(`User with id: ${taskData.user.id} doesn't exist.`));
        }
      });
    });
    describe('and task name doesn\'t exist in the database', () => {
      it('should save the task in the database', async () => {
        expect(await service.create(taskData)).toEqual({ id: 1, ...taskData });
      });
    });
  });
  describe('when getting all tasks of a user', () => {
    describe('and user id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.findAll = jest.fn().mockRejectedValue(new BadRequestException(`User with id: 1 doesn't exist.`));
      });
      it('should throw a bad request exception with specified message', async () => {
        try {
          await service.findAll(1);
        } catch (error) {
          expect(error).toEqual(new BadRequestException(`User with id: 1 doesn't exist.`));
        }
      });
    });
    describe('and user id exists in the database', () => {
      it('should return all tasks of that user', async () => {
        const tasks = await service.findAll(1);
        expect(tasks).toEqual([{ id: 1, ...taskData }]);
        tasks.forEach((task) => {
          expect(task.user?.id).toEqual(1);
        });
      });
    });
  });
  describe('when updating a task', () => {
    describe('and task id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.update = jest.fn().mockRejectedValue(new BadRequestException(`Task with id: 1 doesn't exist.`));
      });
      it('should throw a bad request exception with specified message', async () => {
        try {
          await service.update(1, taskData);
        } catch (error) {
          expect(error).toEqual(new BadRequestException(`Task with id: 1 doesn't exist.`));
        }
      });
    });
    describe('and user id is updated and doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.update = jest.fn().mockRejectedValue(new BadRequestException(`User with id: 1 doesn't exist.`));
      });
      it('should throw a bad request exception with specified message', async () => {
        try {
          await service.update(1, taskData);
        } catch (error) {
          expect(error).toEqual(new BadRequestException(`User with id: 1 doesn't exist.`));
        }
      });
    });
    describe('and task name exists in the database', () => {
      beforeEach(() => {
        mockTaskRepository.update = jest.fn().mockRejectedValue(new ConflictException(`Task with name: ${taskData.name} already exists.`));
      });
      it('should throw a conflict exception with specified message', async () => {
        try {
          await service.update(1, taskData);
        } catch (error) {
          expect(error).toEqual(new ConflictException(`Task with name: ${taskData.name} already exists.`));
        }
      });
    });
    describe('and user id is not updated or updated and exists in the database', () => {
      it('should update the task in the database', async () => {
        expect(await service.update(1, taskData)).toEqual({ id: 1, ...taskData });
      });
    });
  });
  describe('when removing a task by id', () => {
    describe('and the task id exists in the database', () => {
      it('should remove exactly one user', async function() {
        expect(await service.remove(1)).toMatchObject({ affected: 1 });
      });
    });
    describe('and the task id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
      });
      it('should throw a bad request exception', async function() {
        try {
          await service.remove(1);
        } catch (e) {
          expect(e).toEqual(new BadRequestException(`Task with id: 1 doesn't exist.`));
        }
      });
    });
  });
});
