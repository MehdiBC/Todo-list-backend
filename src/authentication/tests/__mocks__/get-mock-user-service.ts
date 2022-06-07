import { User } from '../../../model/user/entities/user.entity';

export const getMockUserService = (userData: any) => ({
  findAll: jest.fn().mockResolvedValue([{ id: 1, ...userData }] as User[]),
  findOne: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  findOneByEmail: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  create: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  update: jest.fn().mockResolvedValue({ id: 1, ...userData } as User),
  remove: jest.fn().mockResolvedValue({ affected: 1 }),
});
