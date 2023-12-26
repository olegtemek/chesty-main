import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { UserService } from './user/user.service';
import { SocketWithAuth } from '@entyties/entities';

export class SocketIOAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['*'],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };
    const jwtService = this.app.get(JwtService);
    const userService = this.app.get(UserService);
    const namespaces = ['/api/game', '/api/room'];
    const server: Server = super.createIOServer(port, optionsWithCORS);
    namespaces.forEach((namespace) => {
      server.of(namespace).use(createTokenMiddleware(jwtService, userService));
    });

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, userService: UserService) =>
  async (socket: SocketWithAuth, next) => {
    try {
      const token = extractTokenFromHeader(socket);
      const payload = jwtService.verify(token);
      const { user } = await userService.getUserById(payload.id);
      delete user.password;
      socket.user = user;
      next();
    } catch (e) {
      next(new UnauthorizedException('Token or user not found'));
    }
  };

const extractTokenFromHeader = (socket: Socket): string | undefined => {
  const [type, token] =
    socket.handshake.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
