import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * This class is used when you want to return the User information
 * */
export class LoginUserDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
