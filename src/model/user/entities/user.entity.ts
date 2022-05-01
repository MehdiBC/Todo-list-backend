import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enumerations/role.enum';
import * as bcrypt from 'bcrypt';
import { Task } from '../../task/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({ nullable: false })
  @Exclude()
  password: string;
  @Column({
    enum: Role,
    default: Role.USER,
    nullable: false,
  })
  role: Role;
  @OneToMany(() => Task, (task) => task.users, { cascade: true })
  tasks: Task[];

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }
}
