import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrentUser } from '@modules/common/decorators';
import { STATUS } from '@modules/common/types';

import { UserDto } from './dtos';
import { IConfig } from '@configs/env';
import { IUserService } from './interfaces';
import { ROUTES, SERVICES } from '@utils/constants.util';

@Controller(ROUTES.USER)
export class UserController {
	constructor(
		@Inject(SERVICES.USER_SERVICE)
		private readonly userService: IUserService,
		private readonly cfgService: ConfigService<IConfig>,
	) {}

	@Get('info')
	@HttpCode(HttpStatus.OK)
	async getInfo(@CurrentUser() user: UserDto) {
		return { status: STATUS.SUCCESS, data: user };
	}
}
