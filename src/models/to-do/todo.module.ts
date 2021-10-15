import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
})
export class TodoModule {}
