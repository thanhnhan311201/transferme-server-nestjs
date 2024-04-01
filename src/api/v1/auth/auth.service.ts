import { BadRequestException, Injectable } from '@nestjs/common';

import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto, SigninDto } from './dtos';

import { Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cfgService: ConfigService,
  ) {}

  async genToken(payload: { userId: number; email: string }): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.cfgService.get<string>('secretJwtKey') || 'accessSecret',
        expiresIn:
          this.cfgService.get<string>('accessTokenExpirationTime') || '2h',
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.cfgService.get<string>('secretJwtRefreshKey') || 'refreshSecret',
        expiresIn:
          this.cfgService.get<string>('refreshTokenExpirationTime') || '8h',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
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
      throw new BadRequestException('User not found.');
    }

    if (!compareSync(body.password, user.password)) {
      throw new BadRequestException('Invalid password.');
    }

    const { accessToken, refreshToken } = await this.genToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
