import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { HubGateway } from './hub.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [RoomModule],
  providers: [HubGateway, HubService],
})
export class HubModule {}
