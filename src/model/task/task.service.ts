import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      } else if (
        error?.constraint === DatabaseConstraint.FOREIGN_KEY_TASK_USERID_CONSTRAINT
      ) {
        throw new BadRequestException(`User with id: ${createTask.user.id} doesn't exist.`);
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
    const updateTask = await this.taskRepository.preload({ id, ...updateTaskDto });
    if (updateTask) {
      return this.taskRepository.save(updateTask).catch((error) => {
        if (error?.constraint === DatabaseConstraint.UNIQUE_TASK_NAME_CONSTRAINT) {
          throw new ConflictException(`Task with name: ${updateTask.name} already exists.`);
        } else if (
          error?.constraint === DatabaseConstraint.FOREIGN_KEY_TASK_USERID_CONSTRAINT
        ) {
          throw new BadRequestException(`User with id: ${updateTask.user.id} doesn't exist.`);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }
    throw new NotFoundException(`Task with id: ${updateTask.id} doesn't exist.`);
  }

  remove(id: number) {
    return this.taskRepository.delete(id).then((value => {
      if (value.affected === 0) throw new BadRequestException(`Task with id: ${id} doesn't exist.`);
      return value;
    }));
  }
}
