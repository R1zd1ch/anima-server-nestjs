import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Authorization } from 'shared/decorators/auth.decorator';
import { Authorized } from 'shared/decorators/authorized.decorator';
import { wrapApiResponse } from 'shared/lib/utils/wrap-api-response';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller({ version: '1', path: 'user/settings' })
export class SettingsController {
  public constructor(private readonly settignsService: SettingsService) {}

  @Authorization()
  @Get()
  public async getSettings(@Authorized('id') userId: string) {
    const result = await this.settignsService.getUserSettings(userId);
    return wrapApiResponse(result);
  }

  @Authorization()
  @Patch()
  public async updateSettings(
    @Authorized('id') userId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    const result = await this.settignsService.updateUserSettings(userId, dto);
    return wrapApiResponse(result);
  }
}
