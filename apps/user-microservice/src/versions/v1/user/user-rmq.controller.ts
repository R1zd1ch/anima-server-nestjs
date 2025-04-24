import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMethod } from '@prisma/__generated__';

@Controller({ path: 'users', version: '1' })
export class UserRMQController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'find-user-by-email' })
  async findByEmail(@Payload() email: string) {
    console.log(email);
    return this.userService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'find-user-by-id' })
  async findById(@Payload() userId: string) {
    console.log(userId);
    return this.userService.findById(userId);
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(
    @Payload()
    data: {
      email: string;
      password: string;
      username: string;
      displayName: string;
      picture?: string;
      method: AuthMethod;
      isVerified: boolean;
    },
  ) {
    return this.userService.create(
      data.email,
      data.password,
      data.username,
      data.displayName,
      data.picture ? data.picture : '',
      data.method,
      data.isVerified,
    );
  }
}
