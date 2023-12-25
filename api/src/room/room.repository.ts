import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '@prisma/prisma';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    return await this.prisma.room.create({ data });
  }

  async removeAllByHost(host: string) {
    return await this.prisma.room.deleteMany({
      where: {
        host: host,
      },
    });
  }

  async addEnemy(id: number, enemy: string): Promise<Room> {
    return await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        enemy,
      },
    });
  }

  async getOne(id: number): Promise<Room> {
    return await this.prisma.room.findUnique({ where: { id } });
  }

  async getAll(): Promise<Room[]> {
    return await this.prisma.room.findMany({});
  }

  async update(id: number, data: Prisma.RoomUpdateInput): Promise<Room> {
    return await this.prisma.room.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number): Promise<Room> {
    return await this.prisma.room.delete({ where: { id } });
  }

  async getByHost(host: string): Promise<Room> {
    return await this.prisma.room.findFirst({ where: { host } });
  }
}
