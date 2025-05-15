import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SettingsModule } from './user/settings/settings.module';
import { UploadImageModule } from './upload-image/upload-image.module';

@Module({
  imports: [UserModule, SettingsModule, UploadImageModule],
})
export class V1Module {}
