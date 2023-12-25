import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/api/game',
})
export class GameGateway implements OnGatewayInit {
  constructor(private readonly gameService: GameService) {}
  private server: Server;
  afterInit(server: Server) {
    this.server = server;
  }
}
