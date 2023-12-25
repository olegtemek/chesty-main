import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  host: string;

  @IsString()
  @IsOptional()
  enemy: string;
}
