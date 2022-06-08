import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  public hello(): string {
    return 'Hello Todo';
  }

}
