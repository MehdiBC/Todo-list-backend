import { Controller, Get, Request } from '@nestjs/common';
import { Roles } from './authorisation/role.decorator';
import { Role } from './enum/role.enum';

@Controller()
export class AppController {
  @Get('/hello')
  @Roles(Role.User, Role.Admin)
  getHello(@Request() req): any {
    const { user } = req;
    return user;
  }
}
