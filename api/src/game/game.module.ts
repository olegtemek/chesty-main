import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomModule } from 'src/room/room.module';
import { GameRepository } from './game.repository';

@Module({
  imports: [RoomModule],
  providers: [GameGateway, GameService, GameRepository],
})
export class GameModule {}
