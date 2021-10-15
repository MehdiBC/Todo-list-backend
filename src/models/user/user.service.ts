import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userInDb = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (userInDb) {
      throw new ConflictException(
        `user with email: ${userInDb.email} already exists.`,
      );
    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userInDb = await this.userRepository.findOne({ id });
    if (!userInDb) {
      throw new NotFoundException(`User with id=${id} does not exist`);
    }
    return userInDb;
  }

  async findOneByEmail(email: string): Promise<User> {
    const userInDb = await this.userRepository.findOne({ email });
    if (!userInDb) {
      throw new NotFoundException(`User with email=${email} does not exist`);
    }
    return userInDb;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    return await this.userRepository.save(updateUser);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
