import { Injectable } from '@nestjs/common';
import { AccessKey } from '@prisma/client';
import { PrismaService } from '@prisma/prisma';

@Injectable()
export class AccessKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableKey(key: string): Promise<AccessKey> {
    return await this.prisma.accessKey.findFirst({
      where: {
        key,
      },
    });
  }
}
