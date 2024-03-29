import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto, SigninDto, UserDto } from './dtos';
import { Serialize } from '../interceptors/serialize.interceptor';

import { ConfigService } from '@nestjs/config';

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
    const user = await this.authService.signin(body);

    return { statusCode: 'success', data: { user } };
  }

  @Post('logout')
  async logout(@Body() body: any) {
    console.log(body);
  }

  @Post('refresh')
  async refreshToken(@Body() body: any) {
    console.log(body);
  }
}
