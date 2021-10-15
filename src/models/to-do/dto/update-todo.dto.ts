import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { TodoStatusEnum } from '../entities/todo-status.enum';
import { IsEnum } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsEnum(TodoStatusEnum)
  @Optional()
  status: TodoStatusEnum;
}
