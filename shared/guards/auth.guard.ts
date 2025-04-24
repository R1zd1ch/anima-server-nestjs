import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from 'apps/user-microservice/src/versions/v1/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log(request.session);

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(
        'Недостаточно прав. У вас нет доступа к этому ресурсу.',
      );
    }
    const user = await this.userService.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
