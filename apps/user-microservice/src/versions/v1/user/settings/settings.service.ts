import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'shared/lib/prisma/prisma.service';
import { UserService } from '../user.service';
import { handleError } from 'shared/lib/utils/handle-error';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async createUserSettings(userId: string) {
    try {
      await this.checkUserExists(userId);
      const settings = await this.prismaService.userSettings.create({
        data: { userId },
      });
      return settings;
    } catch (e) {
      handleError(e, 'Ошибка при создании настроек пользователя', this.logger);
    }
  }

  public async getUserSettings(userId: string) {
    try {
      await this.checkUserExists(userId);
      const settings = await this.prismaService.userSettings.findUnique({
        where: { userId },
      });
      if (!settings) throw new NotFoundException('Настройки не найдены');
      return settings;
    } catch (e) {
      handleError(e, 'Ошибка при получении настроек пользователя', this.logger);
    }
  }

  public async checkAndCreateUserSettings(userId: string) {
    try {
      await this.checkUserExists(userId);
      const settings = await this.prismaService.userSettings.findUnique({
        where: { userId },
      });

      if (!settings) return this.createUserSettings(userId);
      return settings;
    } catch (e) {
      handleError(e, 'Ошибка при получении настроек пользователя', this.logger);
    }
  }

  public async updateUserSettings(userId: string, dto: UpdateSettingsDto) {
    try {
      await this.checkUserExists(userId);
      const settings = await this.prismaService.userSettings.findUnique({
        where: { userId },
      });
      if (!settings) throw new NotFoundException('Настройки не найдены');
      const updatedSettings = await this.prismaService.userSettings.update({
        where: { userId },
        data: dto,
      });
      return updatedSettings;
    } catch (e) {
      handleError(
        e,
        'Ошибка при обновлении настроек пользователя',
        this.logger,
      );
    }
  }

  private async checkUserExists(userId: string) {
    const user = await this.userService.findByEmail(userId);
    console.log(user);
    if (!user) throw new NotFoundException('Пользователь не найден');
  }
}
