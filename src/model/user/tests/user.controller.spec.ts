import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { faker } from '@faker-js/faker';
import { Role } from '../enumerations/role.enum';

describe('UserController', () => {
  let controller: UserController;
  let userDto;
  let mockedUserService;

  beforeEach(async () => {
    userDto = {
      email: faker.internet.email(),
      password: faker.internet.password(8),
      role: Role.USER,
    };
    mockedUserService = {
      findAll: jest.fn().mockResolvedValue([] as User[]),
      findOne: jest.fn().mockResolvedValue({} as User),
      findOneByEmail: jest.fn().mockResolvedValue({} as User),
      create: jest.fn().mockResolvedValue({} as User),
      update: jest.fn().mockResolvedValue({} as User),
      remove: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
