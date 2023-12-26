import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async getUserBy(where: Prisma.UserWhereInput): Promise<User> {
    return await this.prisma.user.findFirst({
      where,
    });
  }
}
