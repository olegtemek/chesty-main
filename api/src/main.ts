import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './io-adapter';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new LoggerService();
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT'));
  app.setGlobalPrefix('api');

  //for rest routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useWebSocketAdapter(new SocketIOAdapter(app));
  app.useLogger(logger);
  await app.listen(port);
}
bootstrap();
