import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}
  private server: Server;

  async setServer(server: Server) {
    this.server = server;
  }

  async getAll() {
    try {
      const rooms = await this.roomRepository.getAll();
      return rooms;
    } catch (e) {
      throw new BadGatewayException();
    }
  }

  async getOne(id: number) {
    try {
      const room = await this.roomRepository.getOne(id);
      if (!room) throw new NotFoundException();
      return room;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      await this.removeAllByHost(createRoomDto.host);
      const room = await this.roomRepository.create(createRoomDto);
      return room;
    } catch (e) {
      throw new BadGatewayException();
    }
  }

  async getByHost(host: string): Promise<Room> {
    try {
      const room = await this.roomRepository.getByHost(host);
      return room;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async removeAllByHost(host: string) {
    try {
      const rooms = await this.roomRepository.removeAllByHost(host);
      return rooms;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async addEnemy(roomId: number, enemy: string) {
    try {
      const getRoom = await this.roomRepository.getOne(roomId);
      if (getRoom.enemy) {
        throw new BadGatewayException();
      }
      const room = await this.roomRepository.addEnemy(roomId, enemy);
      return room;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getRooms() {
    try {
      const rooms = await this.getAll();

      this.server.emit('rooms', {
        data: {
          rooms,
        },
      });
    } catch (e) {
      throw new WsException('error');
    }
  }

  async createRoom(client: Socket) {
    try {
      const room = await this.create({
        host: client.handshake.headers.username as string,
      } as CreateRoomDto);
      client.join(`${room.id}`);

      client.send({
        data: {
          roomId: room.id,
        },
      });

      await this.getRooms();
    } catch (e) {
      throw new WsException('error');
    }
  }

  async joinRoom(client: Socket, roomId: string) {
    try {
      const room = await this.getOne(parseInt(roomId));

      if (!room) {
        throw new WsException('error');
      }

      client.join(roomId);

      const addEnemy = await this.addEnemy(
        parseInt(roomId),
        client.handshake.headers.username as string,
      );

      this.server.to(roomId).emit('message', {
        body: {
          message: 'User connected',
          enemy: addEnemy.enemy,
        },
      });
      await this.getRooms();
    } catch (e) {
      console.log(e);

      throw new WsException('error');
    }
  }
}
