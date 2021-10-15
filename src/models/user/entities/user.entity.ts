import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../../enum/role.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Todo } from '../../to-do/entities/todo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;
  @Column({
    nullable: false,
  })
  role: Role;
  @Column({
    nullable: false,
  })
  @Exclude()
  salt: string;
  @OneToMany(() => Todo, (todo) => todo.user, {
    cascade: true,
  })
  todos: Todo[];

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    this.salt = await bcrypt.genSalt(10);
    if (this.password)
      this.password = await bcrypt.hash(this.password, this.salt);
  }
}
