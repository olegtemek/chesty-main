import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['*'],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
      transports: ['websocket'],
    };

    // const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    // server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

// const createTokenMiddleware =
//   (jwtService: JwtService, logger: Logger) =>
//     (socket: SocketWithAuth, next) => {
//       // for Postman testing support, fallback to token header
//       const token =
//         socket.handshake.auth.token || socket.handshake.headers['token'];

//       logger.debug(`Validating auth token before connection: ${token}`);

//       try {
//         const payload = jwtService.verify(token);
//         socket.userID = payload.sub;
//         socket.pollID = payload.pollID;
//         socket.name = payload.name;
//         next();
//       } catch {
//         next(new Error('FORBIDDEN'));
//       }
//     };
