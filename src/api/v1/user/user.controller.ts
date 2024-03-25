import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthService } from './auth.service';

import { CreateUserDTO } from './dtos/create_user.dto';
import { SigninDTO } from './dtos/signin.dto';

import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cfgService: ConfigService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDTO) {
    const user = await this.authService.signup(
      body.email,
      body.username,
      body.password,
      body.confirmPassword,
    );

    return user;
  }

  @Post('signin')
  async signin(@Body() body: SigninDTO) {
    const user = await this.authService.signin(body.email, body.password);

    return user;
  }
}
