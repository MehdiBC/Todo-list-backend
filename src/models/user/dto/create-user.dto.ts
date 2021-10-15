import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
