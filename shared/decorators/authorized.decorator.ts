import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/__generated__';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) return undefined;

    return data ? user[data] : user;
  },
);
