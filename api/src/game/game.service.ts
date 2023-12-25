import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
  private server: Server;

  async setServer(server: Server) {
    this.server = server;
  }
}
