import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { UserRepository } from './user.repository';
import { AccessKeyRepository } from './access-key.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { RefreshUserDto } from './dto/refresh-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessKeyRepository: AccessKeyRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userRepository.getUserBy({
        email: loginUserDto.email,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const passwordMatch = await verify(user.password, loginUserDto.password);

      if (!passwordMatch) {
        throw new BadRequestException('Password is incorrect');
      }

      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (e) {
      throw e;
    }
  }

  async registration(registrationUserDto: RegistrationUserDto) {
    try {
      const accessKey = await this.getAvailableKey(
        registrationUserDto.accessKey,
      );

      const password = await hash(registrationUserDto.password);

      const user = await this.userRepository.create({
        ...registrationUserDto,
        password,
        accessKey: {
          connect: {
            id: accessKey.id,
          },
        },
      });

      const tokens = await this.generateTokens(user);
      return {
        user,
        ...tokens,
      };
    } catch (e) {
      if (e.code == 'P2014') {
        throw new BadRequestException('User key is busy');
      }
      if (e.code == 'P2002') {
        throw new BadRequestException('User email is busy');
      }

      throw e;
    }
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getUserBy({ id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user };
  }

  async refresh(refreshUserDto: RefreshUserDto) {
    const verifyUser = await this.jwtService.verifyAsync(refreshUserDto.token);
    if (!verifyUser) {
      throw new UnauthorizedException('Token was expired');
    }

    const user = await this.userRepository.getUserBy(verifyUser.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const tokens = await this.generateTokens(user);

    return {
      user: user,
      ...tokens,
    };
  }

  private async generateTokens(user: User) {
    const data = { id: user.id, nickname: user.nickname };
    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  private async getAvailableKey(key: string) {
    const accessKey = await this.accessKeyRepository.getAvailableKey(key);
    if (!accessKey) {
      throw new UnauthorizedException('Access key not found :(');
    }

    return accessKey;
  }
}
