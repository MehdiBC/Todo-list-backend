import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Status } from '../enumerations/status.enum';
import { DatabaseConstraint } from '../../database.constraint';

@Entity('tasks')
@Unique(DatabaseConstraint.UNIQUE_TASK_NAME_CONSTRAINT, ['name'])
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
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
