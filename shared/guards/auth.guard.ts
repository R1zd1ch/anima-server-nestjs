import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/__generated__';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ session?: { userId?: string }; user?: any }>();

    if (!request.session || typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(
        'Недостаточно прав. У вас нет доступа к этому ресурсу.',
      );
    }
    const user = await firstValueFrom<User>(
      this.userClient.send({ cmd: 'find-user-by-id' }, request.session.userId),
    );

    request.user = user;

    return true;
  }
}
