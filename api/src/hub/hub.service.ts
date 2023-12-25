import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { RoomService } from 'src/room/room.service';

@Injectable()
export class HubService {
  constructor(private readonly roomService: RoomService) {}
  private server: Server;

  async setServer(server: Server) {
    this.server = server;
  }

  async handleConnection(client: Socket) {
    if (!client.handshake.headers?.username) {
      throw new WsException('Cannot get username');
    }

    try {
      await this.roomService.removeAllByHost(
        client.handshake.headers.username as string,
      );
    } catch (e) {
      throw new WsException('error');
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.roomService.removeAllByHost(
        client.handshake.headers.username as string,
      );
      await this.roomService.getRooms();
    } catch (e) {
      throw new WsException('error');
    }
  }
}
