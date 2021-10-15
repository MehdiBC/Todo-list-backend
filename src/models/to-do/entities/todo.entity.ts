import { TodoStatusEnum } from './todo-status.enum';
import { v4 as uuid } from 'uuid';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column({
    length: 16,
    unique: true,
  })
  name: string;
  @Column({
    length: 255,
  })
  description: string;
  @CreateDateColumn({
    update: false,
  })
  date: Date;
  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.waiting,
  })
  status: TodoStatusEnum;
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
