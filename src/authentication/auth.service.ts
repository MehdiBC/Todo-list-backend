import { Injectable } from '@nestjs/common';
import { UserService } from '../model/user/user.service';
import { LoginUserDto } from '../model/user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenAuth } from './token.auth';
import { CreateUserDto } from '../model/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<LoginUserDto> {
    const userInDb = await this.userService.findOneByEmail(email);
    if (userInDb) {
      const isMatch = await bcrypt.compare(password, userInDb.password);
      if (isMatch) {
        return {
          id: userInDb.id,
          email: userInDb.email,
        };
      }
    }
    return null;
  }

  async login(user: LoginUserDto): Promise<TokenAuth> {
    const payload = {
      username: user.email,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<TokenAuth> {
    const user = await this.userService.create(createUserDto);
    return await this.login(user);
  }
}
