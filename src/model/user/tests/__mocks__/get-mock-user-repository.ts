import { User } from '../../entities/user.entity';
import { mockedUser } from './mocked-user';

export const getMockUserRepository = () => ({
  create: jest.fn().mockReturnValue(mockedUser as User),
  save: jest.fn().mockResolvedValue({ id: 1, ...mockedUser } as User),
  findOne: jest.fn().mockResolvedValue({ id: 1, ...mockedUser } as User),
  find: jest.fn().mockResolvedValue([{ id: 1, ...mockedUser }] as User[]),
  preload: jest.fn().mockResolvedValue({ id: 1, ...mockedUser } as User),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
});
