import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { RoomService } from './room.service';
import { SocketWithAuth } from '@entyties/entities';
import { ParseIntPipe, UseFilters } from '@nestjs/common';
import { ExceptionFilter } from 'src/exception.filter';

@UseFilters(new ExceptionFilter())
@WebSocketGateway({
  namespace: '/api/room',
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    this.roomService.setServer(server);
  }

  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    return await this.roomService.handleConnection(client);
  }

  async handleDisconnect(@ConnectedSocket() client: SocketWithAuth) {
    return await this.roomService.handleDisconnect(client);
  }

  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() client: SocketWithAuth) {
    return await this.roomService.createRoom(client);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('roomId', ParseIntPipe) roomId: number,
  ) {
    return await this.roomService.joinRoom(client, roomId);
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    return await this.roomService.getRooms();
  }
}
