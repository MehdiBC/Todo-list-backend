import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../authorisation/role.decorator';

@Roles(Role.Admin)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) id: number): Promise<User> {
    const userInDb = await this.userService.findOne(id);
    if (!userInDb) {
      throw new NotFoundException(`User with id=${id} does not exist`);
    }
    return userInDb;
  }

  @Roles(Role.User)
  @Patch(':userId')
  async update(
    @Param('userId') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':userId')
  async remove(
    @Param('userId', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return await this.userService.remove(id);
  }
}
