import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../../model/user/dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<LoginUserDto> {
    const validUser: LoginUserDto = await this.authService.validateUser(
      email,
      password,
    );
    if (!validUser) {
      throw new UnauthorizedException('Bad credentials');
    }
    return validUser;
  }
}
