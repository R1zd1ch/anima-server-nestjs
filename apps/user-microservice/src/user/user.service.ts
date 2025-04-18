import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from 'prisma/__generated__';
import { PrismaService } from '../../../../shared/lib/prisma/prisma.service';
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

  public async create(
    email: string,
    password: string,
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
        picture,
        method,
        isVerified,
      },
      update: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        picture,
        method,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });

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
}
