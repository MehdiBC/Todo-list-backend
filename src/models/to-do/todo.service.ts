import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly userService: UserService,
  ) {}

  async findAllTodos(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async findAllTodosOfUser(userId: number): Promise<Todo[]> {
    return await this.todoRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async createTodo(todo: CreateTodoDto, userId: number): Promise<Todo> {
    const newTodo = this.todoRepository.create(todo);
    newTodo.user = await this.userService.findOne(userId);
    return await this.todoRepository.save<Todo>(newTodo);
  }

  async updateToDo(id: string, updateTodo: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepository.preload({
      id,
      ...updateTodo,
    });
    if (todo) return await this.todoRepository.save(todo);
    throw new NotFoundException(`Todo with id: ${id} doesn't exist`);
  }

  async findToDoById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id);
    if (todo) return todo;
    throw new NotFoundException(`Todo with id: ${id} doesn't exist`);
  }

  async deleteToDo(id: string): Promise<DeleteResult> {
    return await this.todoRepository.delete(id);
  }
}
