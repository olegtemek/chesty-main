import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from 'src/exception.filter';
import { SocketWithAuth } from '@entyties/entities';

@UsePipes(
  new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => new WsException(errors),
  }),
)
@UseFilters(new ExceptionFilter())
@WebSocketGateway({
  namespace: '/api/game',
})
export class GameGateway implements OnGatewayInit {
  constructor(private readonly gameService: GameService) {}
  private server: Server;
  afterInit(server: Server) {
    return this.gameService.setServer(server);
  }

  @SubscribeMessage('game')
  gameStart(@ConnectedSocket() client: SocketWithAuth) {
    return this.gameService.game(client);
  }
}
