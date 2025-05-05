import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/__generated__';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SoftAuthGuard implements CanActivate {
  public constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx
      .switchToHttp()
      .getRequest<{ session?: { userId?: string }; user?: any }>();

    const userId = request.session?.userId;
    if (!userId) {
      request.user = undefined;
      return true;
    }

    try {
      const user = await firstValueFrom<User>(
        this.userClient.send({ cmd: 'find-user-by-id' }, userId),
      );
      request.user = user;
    } catch {
      request.user = undefined;
    }

    return true;
  }
}
