import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseConstraint } from '../../database.constraint';
import { TaskController } from '../task.controller';
import { mockedTaskData } from './__mocks__/mockedTaskData';
import { TaskService } from '../task.service';
import { Task } from '../entities/task.entity';
import { getMockTaskRepository } from './__mocks__/get-mock-task-repository';
import { expect } from '@jest/globals';

describe('TaskController integration with TaskService', () => {
  let app: INestApplication;
  const apiClient = () => supertest(app.getHttpServer());
  let controller: TaskController;
  let mockTaskRepository;
  let taskData;

  beforeEach(async () => {
    taskData = { ...mockedTaskData };
    mockTaskRepository = getMockTaskRepository(taskData);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = module.get<TaskController>(TaskController);
  });

  afterEach(() => {
    app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when getting all tasks', () => {
    describe('and task id exists in the database', () => {
      it('should have status 200', async () => {
        await apiClient().get('/tasks??user-id=1').expect(200);
      });
      it('should find all tasks', async () => {
        expect((await apiClient().get('/tasks?user-id=1')).body).toEqual([{ id: 1, ...taskData }]);
      });
    });
    describe('and task id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.find = jest.fn().mockRejectedValue(new BadRequestException(`User with id: 1 doesn't exist.`));
      });
      it('should have status 400', async () => {
        await apiClient().get('/tasks?user-id=1').expect(400);
      });
      it('should return a bad request error', async () => {
        expect((await apiClient().get('/tasks?user-id=1')).body?.message).toEqual(`User with id: 1 doesn't exist.`);
      });
    });
  });

  describe('when updating a task by id', () => {
    describe('and task id doesn\'t exist', () => {
      beforeEach(() => {
        mockTaskRepository.preload = jest.fn().mockResolvedValue(null);
      });
      it('should have status 400', async () => {
        await apiClient().patch('/tasks/1').send(taskData).expect(400);
      });
      it('should return a bad request exception with a specific message', async () => {
        expect((await apiClient().patch('/tasks/1').send(taskData)).body?.message).toEqual(`Task with id: 1 doesn't exist.`);
      });
    });
    describe('and user id to update with doesn\'t exist in the database', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.FOREIGN_KEY_TASK_USERID_CONSTRAINT };
        mockTaskRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should have status 400', async () => {
        await apiClient().patch('/tasks/1').send(taskData).expect(400);
      });
      it('should return a conflict error with the specific message', async () => {
        expect((await apiClient().patch('/tasks/1').send(taskData)).body?.message).toEqual(`User with id: ${taskData.user.id} doesn't exist.`);
      });
    });
    describe('and an other task has the name to update with', () => {
      beforeEach(() => {
        const error = { constraint: DatabaseConstraint.UNIQUE_TASK_NAME_CONSTRAINT };
        mockTaskRepository.save = jest.fn().mockRejectedValue(error);
      });
      it('should have status 409', async () => {
        await apiClient().patch('/tasks/1').send(taskData).expect(409);
      });
      it('should return a conflict error with the specific message', async () => {
        expect((await apiClient().patch('/tasks/1').send(taskData)).body?.message).toEqual(`An other task with name: ${taskData.name} exists.`);
      });
    });
    describe('and the task name is not updated or the name to update with doesn\'t exist in the database', () => {
      it('should have status 200', async () => {
        await apiClient().patch('/tasks/1').send(taskData).expect(200);
      });
      it('should update the task', async function() {
        expect((await apiClient().patch('/tasks/1').send(taskData)).body).toEqual({ id: 1, ...taskData });
      });
    });
  });

  describe('when removing a task by id', () => {
    describe('and task id doesn\'t exist in the database', () => {
      beforeEach(() => {
        mockTaskRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
      });
      it('should have status 400', async () => {
        await apiClient().delete('/tasks/1').expect(400);
      });
      it('should return a bad request error with the specific message', async () => {
        expect((await apiClient().delete('/tasks/1')).body?.message).toEqual(`Task with id: 1 doesn't exist.`);
      });
    });
    describe('and task id exists in the database', () => {
      it('should have status 200', async () => {
        await apiClient().delete('/tasks/1').expect(200);
      });
      it('should delete a task', async () => {
        expect((await apiClient().delete('/tasks/1')).body?.affected).toEqual(1);
      });
    });
  });
});
