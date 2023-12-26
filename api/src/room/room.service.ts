import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithAuth } from '@entyties/entities';
import { LoggerService } from '@logger/logger';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('Room service');
  }
  private server: Server;

  async setServer(server: Server) {
    this.server = server;
  }

  async getAll(where: Prisma.RoomWhereInput) {
    return await this.roomRepository.getAll(where);
  }

  async getOne(where: Prisma.RoomWhereInput) {
    try {
      const room = await this.roomRepository.getOne(where);
      if (!room) throw new NotFoundException();
      return room;
    } catch (e) {
      throw e;
    }
  }

  async getRooms() {
    try {
      const rooms = await this.roomRepository.getAll({});

      this.server.emit('rooms', {
        data: {
          rooms,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async createRoom(client: SocketWithAuth) {
    try {
      await this.removeAllByUserId(client.user.id);

      const room = await this.roomRepository.create({
        hostId: client.user.id,
        users: {
          connect: {
            id: client.user.id,
          },
        },
        game: {
          create: {},
        },
      });
      client.join(`${room.id}`);

      await this.getRooms();
    } catch (e) {
      throw e;
    }
  }

  async joinRoom(client: SocketWithAuth, roomId: number) {
    try {
      const room = await this.getOne({ id: roomId });
      if (!room) {
        throw new WsException('Cannot find room');
      }

      client.join(`${room.id}`);
      if (room.users.length == 2) {
        throw new WsException('Room has enemy');
      }
      await this.roomRepository.addEnemy(room.id, client.user.id);

      this.server.to(`${roomId}`).emit('message', {
        data: {
          message: 'User connected',
          enemy: client.user.nickname,
        },
      });
      await this.getRooms();
    } catch (e) {
      throw e;
    }
  }

  async handleConnection(client: SocketWithAuth) {
    try {
      this.logger.set(`User connected: ${client.user.email}`);
      await this.removeAllByUserId(client.user.id);
      await this.getRooms();
    } catch (e) {
      throw e;
    }
  }
  async handleDisconnect(client: SocketWithAuth) {
    try {
      await this.removeAllByUserId(client.user.id);
      await this.getRooms();
    } catch (e) {
      throw e;
    }
  }

  async update(
    where: Prisma.RoomWhereUniqueInput,
    data: Prisma.RoomUpdateInput,
  ) {
    return await this.roomRepository.update(where, data);
  }

  private async removeAllByUserId(clientId: number) {
    const rooms = await this.getAll({
      users: { some: { id: clientId } },
      status: 'FIND',
    });

    const roomsToDelete = rooms.filter((room) => room.hostId == clientId);

    const roomsToUpdate = rooms.filter((room) => room.hostId != clientId);

    if (roomsToDelete) {
      await this.roomRepository.removeAllBy({
        id: { in: roomsToDelete.map((item) => item.id) },
      });
    }
    if (roomsToUpdate) {
      for (const room of roomsToUpdate) {
        await this.update(
          {
            id: room.id,
          },
          {
            users: {
              disconnect: { id: clientId },
            },
          },
        );
      }
    }
  }
}
