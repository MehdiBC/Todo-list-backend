import { TodoStatusEnum } from './todo-status.enum';
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
  id: string;
  @Column({
    length: 16,
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
  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: 'CASCADE',
  })
  user: User;
}
