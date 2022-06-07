import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../enumerations/status.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  user: { id: number };
  @IsNotEmpty()
  @IsEnum(Status)
  readonly status: Status;
}
