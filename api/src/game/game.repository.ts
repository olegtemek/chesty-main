import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma';

@Injectable()
export class GameRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.GameCreateInput) {
    return await this.prisma.game.create({ data });
  }
}
