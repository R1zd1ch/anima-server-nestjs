import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthMethod, User } from 'prisma/__generated__';
import { PrismaService } from '../../../../../../shared/lib/prisma/prisma.service';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleError } from 'shared/lib/utils/handle-error';
import { SettingsService } from './settings/settings.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => SettingsService))
    private readonly settingsService: SettingsService,
  ) {}

  public async findById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: { accounts: true },
      });

      if (!user)
        throw new NotFoundException(`Пользователь с id ${id} не найден`);

      return user;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async getUserWithSettings(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          displayName: true,
          username: true,
          picture: true,
          email: true,
          isTwoFactorEnabled: true,
        },
      });

      if (!user)
        throw new NotFoundException(`Пользователь с id ${id} не найден`);
      const settings =
        await this.settingsService.checkAndCreateUserSettings(id);

      return { ...user, settings };
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async getPublicProfile(id: string) {
    try {
      const user = await this.findById(id);
      const settings =
        await this.settingsService.checkAndCreateUserSettings(id);

      const publicProfile = {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        picture: user.picture,
        banner: user.banner,
      } as Partial<User>;

      if (settings.showEmail) publicProfile.email = user.email;
      if (settings.showBio && user.bio) publicProfile.bio = user.bio;
      if (settings.showGender) publicProfile.gender = user.gender;
      if (settings.showCountry && user.country)
        publicProfile.country = user.country;
      if (settings.showCity && user.city) publicProfile.city = user.city;
      if (settings.showBirthday && user.birthday)
        publicProfile.birthday = user.birthday;
      if (settings.showJoined) {
        publicProfile.createdAt = user.createdAt;
        publicProfile.updatedAt = user.updatedAt;
      }

      return publicProfile;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async findByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
        include: { accounts: true },
      });

      return user;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async findByUsername(username: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { username },
        include: { accounts: true },
      });

      if (!user) {
        throw new NotFoundException(
          `Пользователь с username ${username} не найден`,
        );
      }

      return user;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async create(
    email: string,
    password: string,
    username: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    try {
      const user = await this.prismaService.user.upsert({
        where: { email },
        create: {
          email,
          password: password ? await hash(password) : '',
          displayName,
          username,
          picture,
          method,
          isVerified,
          settings: {
            create: {},
          },
        },
        update: {
          email,
          // password: password ? await hash(password) : '',
          // displayName,
          // username,
          // picture,
          // method,
          isVerified,
        },
        include: { accounts: true, settings: true },
      });

      if (!user.settings)
        await this.settingsService.checkAndCreateUserSettings(user.id);

      return user;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async update(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.findById(userId);
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: dto,
      });

      return updatedUser;
    } catch (e) {
      handleError(e, 'Пользователь не найден', this.logger);
    }
  }

  public async delete(id: string) {
    const user = await this.findById(id);
    return this.prismaService.user.delete({ where: { id: user.id } });
  }
}
