import { Controller } from '@nestjs/common';

import { UserService } from './user.service';

import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private cfgService: ConfigService,
  ) {}
}
