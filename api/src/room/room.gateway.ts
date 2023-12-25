import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: '/api/room',
})
export class RoomGateway implements OnGatewayInit {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    this.roomService.setServer(server);
  }

  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() client: Socket) {
    return await this.roomService.createRoom(client);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    return await this.roomService.joinRoom(client, roomId);
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    return await this.roomService.getRooms();
  }
}
