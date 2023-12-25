import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { HubService } from './hub.service';

@WebSocketGateway({
  namespace: '/api',
})
export class HubGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(private readonly hubService: HubService) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    this.hubService.setServer(server);
  }

  async handleConnection(client: Socket) {
    return await this.hubService.handleConnection(client);
  }

  async handleDisconnect(client: Socket) {
    return await this.hubService.handleDisconnect(client);
  }
}
