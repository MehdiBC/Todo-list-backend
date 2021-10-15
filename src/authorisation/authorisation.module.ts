import { Module } from '@nestjs/common';
import { RolesGuard } from './RolesGuard';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class AuthorisationModule {}
