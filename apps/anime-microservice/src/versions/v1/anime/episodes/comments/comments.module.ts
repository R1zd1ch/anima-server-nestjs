import { Module } from '@nestjs/common';
import { CommentsConroller } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [],
  controllers: [CommentsConroller],
  providers: [CommentsService],
})
export class CommentsModule {}
