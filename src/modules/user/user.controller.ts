import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from '@modules/common/decorators';
import { STATUS } from '@modules/common/types';
import { User } from './user.entity';

import { ConfigService } from '@nestjs/config';
import IConfig from 'src/config';

@Controller('user')
export class UserController {
	constructor(
		// eslint-disable-next-line no-unused-vars
		private userService: UserService,
		// eslint-disable-next-line no-unused-vars
		private cfgService: ConfigService<IConfig>,
	) {}

	@Get('info')
	@HttpCode(HttpStatus.OK)
	async logout(@CurrentUser() user: User) {
		return { status: STATUS.SUCCESS, data: user };
	}
}
