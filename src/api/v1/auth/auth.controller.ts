import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto, SigninDto, UserDto } from './dtos';
import { Serialize } from '../common/interceptors';
import { GetCurrentUser } from '../common/decorators';

import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtAuthGuard, JwtRefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cfgService: ConfigService,
  ) {}

  @Post('signup')
  @Serialize(UserDto)
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);

    return { statusCode: 'success', data: { user } };
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    const userDto = await this.authService.signin(body);

    return { statusCode: 'success', data: { ...userDto } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() reg: Request) {
    console.log('reg....', reg);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Req() reg: Request) {
    console.log('reg....', reg);
  }
}
