import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { RoomGateway } from './room.gateway';

@Module({
  providers: [RoomGateway, RoomService, RoomRepository],
  exports: [RoomGateway, RoomService, RoomRepository],
})
export class RoomModule {}
