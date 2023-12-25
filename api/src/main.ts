import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
