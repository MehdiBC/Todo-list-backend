import { faker } from '@faker-js/faker';
import { Status } from '../../enumerations/status.enum';

export const mockedTaskData = {
  name: faker.name.firstName(),
  description: faker.name.jobDescriptor(),
  status: Status.TODO,
  user: { id: 1 },
};
