import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: `name must be with length bigger than 6`,
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
