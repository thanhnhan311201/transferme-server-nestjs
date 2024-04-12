import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

import {
  CreateUserDto,
  GitHubLoginDto,
  GoogleLoginDto,
  RefreshTokenDto,
  SigninDto,
  UserDto,
  VerifyEmailDto,
} from './dtos';
import { Serialize } from '../common/interceptors';
import { CurrentUser, Public } from '../common/decorators';
import { JwtRefreshTokenGuard } from '../common/guards';
import { User } from '../user/user.entity';

import { STATUS } from '../common/types/status-code.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Serialize(UserDto)
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);

    return { status: STATUS.SUCCESS, data: { user } };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: SigninDto) {
    const token = await this.authService.signin(body);

    return { status: STATUS.SUCCESS, data: { ...token } };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    await this.authService.signout(user.id);
    return { status: STATUS.SUCCESS };
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const token = await this.authService.refreshAccessToken(body.refreshToken);

    return { status: STATUS.SUCCESS, data: { ...token } };
  }

  @Get('verify-access-token')
  @HttpCode(HttpStatus.OK)
  refreshSignin() {
    return { status: STATUS.SUCCESS };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: VerifyEmailDto) {
    await this.authService.verifyEmail(body.email);

    return { status: STATUS.SUCCESS };
  }

  @Public()
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() body: GoogleLoginDto) {
    const token = await this.authService.googleLogin(body.authCode);

    return { status: STATUS.SUCCESS, data: { ...token } };
  }

  @Public()
  @Post('github')
  @HttpCode(HttpStatus.OK)
  async githubLoginCallback(@Body() body: GitHubLoginDto) {
    const token = await this.authService.githubAuthentication(body.authCode);

    return { status: STATUS.SUCCESS, data: { ...token } };
  }
}
