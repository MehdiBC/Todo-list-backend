import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { Role } from './enumerations/role.enum';
import { Roles } from '../../authorisation/role.decorator';

@Roles(Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const userInDb = await this.userService.findOne(id);
    if (!userInDb) {
      throw new NotFoundException(`User with id=${id} does not exist`);
    }
    return userInDb;
  }

  @Roles(Role.USER)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.remove(id);
  }
}
