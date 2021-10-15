import { IsNotEmpty } from 'class-validator';

export class TokenAuth {
  @IsNotEmpty()
  accessToken: string;
}
