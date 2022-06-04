import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enumerations/role.enum';
import * as bcrypt from 'bcrypt';
import { DatabaseConstraint } from '../../database.constraint';

@Entity('users')
@Unique(DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT, ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
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

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }
}
