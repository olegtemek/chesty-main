import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrationUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  accessKey: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
