import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './enumerations/role.enum';

describe('UserService', () => {
  let service: UserService;

  const users = [];

  const createUserDto = {
    email: 'mehdi.benchikha@gmail.com',
    password: 'lol',
    role: Role.USER,
  };

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => {
      const createdUser = {
        id: Date.now(),
        ...user,
      };
      users.push(createdUser);
      return Promise.resolve(createdUser);
    }),
    findOne: jest.fn().mockImplementation((object) => {
      let user;
      if (object.email) {
        user = users.find((u) => u.email === object.email);
      } else if (object.id) {
        user = users.find((u) => u.id === object.id);
      }
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async function() {
    expect(await service.create(createUserDto)).toEqual({
      id: expect.any(Number),
      ...createUserDto,
    });
  });

  it('should find a user by email if exists', async function() {
    expect(await service.findOneByEmail(createUserDto.email)).toEqual({
      id: expect.any(Number),
      ...createUserDto,
    });
  });
});
