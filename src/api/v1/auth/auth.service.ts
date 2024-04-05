import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto, SigninDto } from './dtos';

import { JwtPayload, Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cfgService: ConfigService,
  ) {}

  async genToken(userId: number, email: string): Promise<Tokens> {
    const jwtPayload = { userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.cfgService.get<string>('auth.secretJwtKey'),
        expiresIn: this.cfgService.get<string>(
          'auth.accessTokenExpirationTime',
        ),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.cfgService.get<string>('auth.secretJwtRefreshKey'),
        expiresIn: this.cfgService.get<string>(
          'auth.refreshTokenExpirationTime',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const rtHash = hashSync(refreshToken, 12);

    return this.userService.update(userId, { refresh_token: rtHash });
  }

  async signup(body: CreateUserDto): Promise<User> {
    const users = await this.userService.find(body.email);
    if (users.length) {
      throw new BadRequestException('Email already exists.');
    }

    // compare password and confirm password
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Confirm password has to match.');
    }

    // Hash the user password
    const hash = hashSync(body.password, 12);

    // Create a new user and save it
    const user = await this.userService.create({
      email: body.email,
      password: hash,
      username: body.username,
    });

    return user;
  }

  async signin(body: SigninDto) {
    const [user] = await this.userService.find(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!compareSync(body.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const { accessToken, refreshToken } = await this.genToken(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  logout(userId: number) {
    return this.userService.update(userId, { refresh_token: null });
  }

  async refreshAccessToken(refreshToken: string) {
    let decoded: JwtPayload;
    try {
      decoded = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.cfgService.get<string>('auth.secretJwtRefreshKey'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const user = await this.userService.findOne(decoded.userId);
    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Invalid refresh token.');

    if (!compareSync(refreshToken, user.refresh_token)) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.genToken(user.id, user.email);

    await this.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
