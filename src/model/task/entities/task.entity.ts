import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Status } from '../enumerations/Status';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;
  @Column()
  description: string;
  @Column({
    enum: Status,
    default: Status.TODO,
    nullable: false,
  })
  status: Status;
  @OneToMany(() => User, (user) => user.tasks)
  users: User[];
}
