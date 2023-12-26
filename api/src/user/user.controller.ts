import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDecorator } from './user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth.guard';
import { RefreshUserDto } from './dto/refresh-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(
    @Body('') registrationUserDto: RegistrationUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const registration =
      await this.userService.registration(registrationUserDto);
    response.cookie('accessToken', registration.accessToken);
    response.cookie('refreshToken', registration.refreshToken);
    return registration;
  }

  @Post('login')
  async login(
    @Body('') loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const login = await this.userService.login(loginUserDto);
    response.cookie('accessToken', login.accessToken);
    response.cookie('refreshToken', login.refreshToken);
    return login;
  }

  @Post('refresh')
  async refreshToken(
    @Body() refreshUserDto: RefreshUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh = await this.userService.refresh(refreshUserDto);
    response.cookie('accessToken', refresh.accessToken);
    response.cookie('refreshToken', refresh.refreshToken);
    return refresh;
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@UserDecorator() user: User) {
    return this.userService.getUserById(user.id);
  }
}
