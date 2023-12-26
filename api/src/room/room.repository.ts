import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '@prisma/prisma';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    return await this.prisma.room.create({ data });
  }

  async removeAllBy(where: Prisma.RoomWhereInput) {
    return await this.prisma.room.deleteMany({
      where,
    });
  }

  async addEnemy(id: number, enemyId: number): Promise<Prisma.RoomWhereInput> {
    return await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        users: {
          connect: {
            id: enemyId,
          },
        },
        status: 'ACTIVE',
      },
    });
  }

  async getOne(where: Prisma.RoomWhereInput) {
    return await this.prisma.room.findFirst({
      where,
      include: {
        users: { select: { id: true, nickname: true } },
        game: true,
      },
    });
  }

  async getAll(where: Prisma.RoomWhereInput) {
    return await this.prisma.room.findMany({ where, include: { users: true } });
  }

  async update(
    where: Prisma.RoomWhereUniqueInput,
    data: Prisma.RoomUpdateInput,
  ) {
    return await this.prisma.room.update({
      where,
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.room.delete({ where: { id } });
  }
}
