import { Module } from '@nestjs/common';

import { RoomModule } from './room/room.module';
import { PrismaModule } from '@prisma/prisma';
import { HubModule } from './hub/hub.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RoomModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
