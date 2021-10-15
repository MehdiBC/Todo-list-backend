import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DeleteResult } from 'typeorm';
import { Roles } from '../../authorisation/role.decorator';
import { Role } from '../../enum/role.enum';

@Roles(Role.Admin)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAllTodos(): Promise<Todo[]> {
    return this.todoService.findAllTodos();
  }

  @Roles(Role.User)
  @Get('user')
  async findAllTodosOfUser(@Request() req): Promise<Todo[]> {
    return this.todoService.findAllTodosOfUser(req.user.userId);
  }

  @Roles(Role.User)
  @Post()
  async addTodo(@Body() todo: CreateTodoDto, @Request() req): Promise<Todo> {
    return await this.todoService.createTodo(todo, req.user.userId);
  }

  @Roles(Role.User)
  @Get(':todoId')
  async findTodoById(@Param('todoId') todoId: string): Promise<Todo> {
    return await this.todoService.findToDoById(todoId);
  }

  @Roles(Role.User)
  @Delete(':todoId')
  async deleteTodo(@Param('todoId') todoId: string): Promise<DeleteResult> {
    return await this.todoService.deleteToDo(todoId);
  }

  @Roles(Role.User)
  @Put(':todoId')
  async updateTodo(
    @Param('todoId') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todoService.updateToDo(todoId, updateTodoDto);
  }
}
