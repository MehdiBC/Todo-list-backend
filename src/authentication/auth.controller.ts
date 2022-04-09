import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TokenAuth } from './token.auth';
import { CreateUserDto } from '../model/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<TokenAuth> {
    return await this.authService.login(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<TokenAuth> {
    return await this.authService.signUp(createUserDto);
  }
}
