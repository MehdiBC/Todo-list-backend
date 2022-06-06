import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConstraint } from '../database.constraint';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser).catch((error) => {
      if (
        error?.constraint === DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT
      ) {
        throw new ConflictException(
          `User with email: ${createUserDto.email} already exists.`,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = await this.userRepository.preload({ id, ...updateUserDto });
    if (updateUser) {
      return this.userRepository.save(updateUser).catch((error) => {
        if (
          error?.constraint === DatabaseConstraint.UNIQUE_USER_EMAIL_CONSTRAINT
        ) {
          throw new ConflictException(`An other user with email: ${updateUser.email} exists.`);
        }
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
    }
    throw new BadRequestException(`User with id: ${id} doesn't exist.`);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id).then((value => {
      if (value.affected === 0) throw new BadRequestException(`User with id: ${id} doesn't exist.`);
      return value;
    }));
  }
}
