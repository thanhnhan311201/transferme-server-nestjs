import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators';
import { User } from './user.entity';

import { ConfigService } from '@nestjs/config';
import { STATUS } from '../common/types';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private cfgService: ConfigService,
  ) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    return { status: STATUS.SUCCESS, data: user };
  }
}
