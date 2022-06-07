import { Task } from '../../entities/task.entity';

export const getMockTaskRepository = (taskData) => ({
  create: jest.fn().mockReturnValue({ id: 1, ...taskData } as Task),
  save: jest.fn().mockResolvedValue({ id: 1, ...taskData } as Task),
  findOne: jest.fn().mockResolvedValue({ id: 1, ...taskData } as Task),
  find: jest.fn().mockResolvedValue([{ id: 1, ...taskData }] as Task[]),
  preload: jest.fn().mockResolvedValue({ id: 1, ...taskData } as Task),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
});
