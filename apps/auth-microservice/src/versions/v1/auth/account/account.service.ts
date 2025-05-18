import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '@prisma/__generated__';
import { PrismaService } from 'shared/lib/prisma/prisma.service';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async linkAccount(
    userId: string,
    accountData: Omit<Account, 'updatedAt' | 'createdAt' | 'id' | 'userId'>,
  ) {
    const isLinked = await this.prismaService.account.findUnique({
      where: { userId_provider: { userId, provider: accountData.provider } },
    });

    if (isLinked) return isLinked;

    return this.prismaService.account.create({
      data: { userId, ...accountData },
    });
  }

  public async unlinkAccount(userId: string, provider: string): Promise<void> {
    const account = await this.prismaService.account.findUnique({
      where: { userId_provider: { userId, provider } },
    });

    if (!account) {
      throw new NotFoundException(
        `Аккаунт с провайдером ${provider} не найден`,
      );
    }

    await this.prismaService.account.delete({
      where: { userId_provider: { userId, provider } },
    });
  }

  public async getLinkedAccounts(userId: string) {
    return this.prismaService.account.findMany({ where: { userId } });
  }
}
