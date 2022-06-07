import { faker } from '@faker-js/faker';

export const mockedUserLoginCredentials = {
  email: faker.internet.email(),
  password: faker.internet.password(8),
};
