import { faker } from '@faker-js/faker';
import { Role } from '../../enumerations/role.enum';

export const mockedUser = {
  email: faker.internet.email(),
  password: faker.internet.password(8),
  role: Role.USER,
};
