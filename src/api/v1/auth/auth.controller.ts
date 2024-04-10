import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto, RefreshTokenDto, SigninDto, UserDto } from './dtos';
import { Serialize } from '../common/interceptors';
import { CurrentUser, Public } from '../common/decorators';
import { JwtRefreshTokenGuard } from '../common/guards';
import { User } from '../user/user.entity';

import { STATUS_CODE } from '../common/types/status-code.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Serialize(UserDto)
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);

    return { statusCode: STATUS_CODE.SUCCESS, data: { user } };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: SigninDto) {
    const token = await this.authService.signin(body);

    return { statusCode: STATUS_CODE.SUCCESS, data: { ...token } };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return { statusCode: STATUS_CODE.SUCCESS };
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    const token = await this.authService.refreshAccessToken(
      refreshToken.refreshToken,
    );

    return { statusCode: STATUS_CODE.SUCCESS, data: { ...token } };
  }
}
