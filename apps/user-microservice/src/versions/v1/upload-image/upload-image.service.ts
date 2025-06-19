import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';

@Injectable({})
export class UploadImageService {
  public constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
  ) {}

  public async uploadAvatar(file: Express.Multer.File, userId: string) {
    try {
      const uuid = uuidv4();
      console.log(file);
      if (!file) throw new BadRequestException('Нет файла аватара');
      const path = `${uuid}_${file.originalname}`;

      const publicUrl = await this.supabaseService.uploadFile(
        file,
        'user-avatars',
        path,
      );

      await this.updateUserData(userId, publicUrl, 'avatar');

      return { url: publicUrl };
    } catch (error: unknown) {
      this.handleImageError(error, 'Ошибка при загрузке аватара');
    }
  }

  public async uploadBanner(file: Express.Multer.File, userId: string) {
    try {
      const uuid = uuidv4();
      if (!file) throw new BadRequestException('Нет файла баннера');
      const path = `banners/${uuid}_${file.originalname}`;
      const publicUrl = await this.supabaseService.uploadFile(
        file,
        'user-banners',
        path,
      );

      await this.updateUserData(userId, publicUrl, 'banner');

      return { url: publicUrl };
    } catch (error: unknown) {
      this.handleImageError(error, 'Ошибка при загрузке баннера');
    }
  }

  private async updateUserData(
    userid: string,
    url: string,
    type: 'avatar' | 'banner',
  ) {
    const user = await this.userService.findById(userid);
    const updateField = type === 'avatar' ? 'picture' : 'banner';

    return await this.userService.update(userid, {
      email: user.email,
      displayName: user.displayName,
      [updateField]: url,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    });
  }

  private handleImageError(error: unknown, message: string) {
    throw new BadRequestException(
      `${message}: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    );
  }
}
