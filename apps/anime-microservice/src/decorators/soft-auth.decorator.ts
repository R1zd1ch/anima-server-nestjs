import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/__generated__';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { SoftAuthGuard } from '../guards/soft-auth.guard';

export function SoftAuthorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(
      Roles(...roles),
      UseGuards(SoftAuthGuard, RolesGuard),
    );
  }

  return applyDecorators(UseGuards(SoftAuthGuard));
}
