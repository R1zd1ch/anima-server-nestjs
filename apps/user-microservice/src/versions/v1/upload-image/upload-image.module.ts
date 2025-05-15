import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';
import { UploadImageService } from './upload-image.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SupabaseModule, UserModule],
  controllers: [UploadImageController],
  providers: [UploadImageService],
})
export class UploadImageModule {}
