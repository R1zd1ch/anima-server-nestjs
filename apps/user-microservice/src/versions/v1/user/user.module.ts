import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AnimeModule } from './anime/anime.module';
import { UserRMQController } from './user-rmq.controller';

@Module({
  imports: [forwardRef(() => AnimeModule)],
  controllers: [UserController, UserRMQController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
