import { User } from '../../../model/user/entities/user.entity';

export const getMockUserRepository = (userData: any) => ({
  create: jest.fn().mockReturnValue({ id: 1, ...userData } as User),
  save: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  findOne: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  find: jest.fn().mockResolvedValue([{ id: 1, ...userData }] as User[]),
  preload: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
});
