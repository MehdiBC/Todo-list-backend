import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseConstraint } from '../database.constraint';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(createTask).catch((error) => {
      if (
        error?.constraint === DatabaseConstraint.UNIQUE_TASK_NAME_CONSTRAINT
      ) {
        throw new ConflictException(
          `Task with name: ${createTask.name} already exists.`,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  findAll(userId: number) {
    return this.taskRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateTodo = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });
    return this.taskRepository.save(updateTodo).catch((error) => {
      if (
        error?.constraint === DatabaseConstraint.UNIQUE_TASK_NAME_CONSTRAINT
      ) {
        throw new ConflictException(
          `Task with name: ${updateTodo.name} already exists.`,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
