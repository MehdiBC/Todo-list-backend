import { User } from '../../../model/user/entities/user.entity';
import { mockedUserLoginCredentials } from './mocked-user-login-credentials';

export const getMockUserService = () => ({
  findAll: jest.fn().mockResolvedValue([mockedUserLoginCredentials] as User[]),
  findOne: jest.fn().mockResolvedValue({ id: 1, ...mockedUserLoginCredentials }),
  findOneByEmail: jest.fn().mockResolvedValue({ id: 1, ...mockedUserLoginCredentials }),
  create: jest.fn().mockResolvedValue({ id: 1, ...mockedUserLoginCredentials }),
  update: jest.fn().mockResolvedValue({ id: 1, ...mockedUserLoginCredentials }),
  remove: jest.fn().mockResolvedValue({ affected: 1 }),
});
