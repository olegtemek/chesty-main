import { Module } from '@nestjs/common';

import { RoomModule } from './room/room.module';
import { PrismaModule } from '@prisma/prisma';

import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from '@logger/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LoggerModule,
    RoomModule,
    GameModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
