import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from '@modules/Common/decorators';
import { STATUS } from '@modules/Common/types';
import { User } from '@modules/User/user.entity';

import { ConfigService } from '@nestjs/config';
import IConfig from 'src/config';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private cfgService: ConfigService<IConfig>,
	) {}

	@Get('info')
	@HttpCode(HttpStatus.OK)
	async logout(@CurrentUser() user: User) {
		return { status: STATUS.SUCCESS, data: user };
	}
}
