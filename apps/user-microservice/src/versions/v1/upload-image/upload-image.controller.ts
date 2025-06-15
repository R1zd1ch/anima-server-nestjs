import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';
import { Authorization } from 'apps/user-microservice/src/decorators/auth.decorator';
import { Authorized } from 'apps/user-microservice/src/decorators/authorized.decorator';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';

@Controller({ path: 'user/upload-image', version: '1' })
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Authorization()
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile('file') file: Express.Multer.File,
    @Authorized('id') userId: string,
  ) {
    const result = await this.uploadImageService.uploadAvatar(file, userId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Post('banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(
    @UploadedFile('file') file: Express.Multer.File,
    @Authorized('id') userId: string,
  ) {
    const result = await this.uploadImageService.uploadBanner(file, userId);
    return wrapApiResponse(result);
  }
}
