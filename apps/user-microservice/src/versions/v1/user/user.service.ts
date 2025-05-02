import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod, UserSettings } from 'prisma/__generated__';
import { PrismaService } from '../../../../../../shared/lib/prisma/prisma.service';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return user;
  }

  public async getUserWithSettings(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        picture: true,
        email: true,
        isTwoFactorEnabled: true,
      },
    });

    let settings = await this.prismaService.userSettings.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    if (!settings) {
      settings = await this.cheackAndCreateSettings(user.id);
    }

    return {
      ...user,
      settings: {
        ...settings,
      },
    };
  }

  public async getPublicProfile(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        picture: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  public async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }

    return user;
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
    const user = await this.prismaService.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        username,
        picture,
        method,
        isVerified,
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
      include: {
        accounts: true,
      },
    });

    await this.cheackAndCreateSettings(user.id);

    return user;
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        displayName: dto.name,
        email: dto.email,
        isTwoFactorEnabled: dto.isTwoFactorEnabled,
      },
    });

    return updatedUser;
  }

  public async updateSettings(userId: string, dto: Partial<UserSettings>) {
    const user = await this.findById(userId);

    const updatedUser = await this.prismaService.userSettings.update({
      where: {
        userId: user.id,
      },
      data: dto,
    });

    return updatedUser;
  }

  private async cheackAndCreateSettings(userId: string) {
    const settings = await this.prismaService.userSettings.findUnique({
      where: {
        userId,
      },
    });

    if (!settings) {
      await this.prismaService.userSettings.create({
        data: {
          userId,
        },
      });
      return settings;
    }

    return settings;
  }

  public async delete(id: string) {
    const user = await this.findById(id);

    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });

    return user;
  }
}
