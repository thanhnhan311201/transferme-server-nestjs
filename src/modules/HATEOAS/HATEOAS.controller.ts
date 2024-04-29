import { Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Public } from '@modules/Common/decorators';
import { STATUS } from '@modules/Common/types/status-code.type';

import IConfig, { IGeneralConfig } from 'src/config';

@Controller()
export class HATEOASController {
	constructor(private cfgService: ConfigService<IConfig>) {}

	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async getApiLinks() {
		return {
			status: STATUS.SUCCESS,
			data: {
				apis: {
					user_signin: `${this.cfgService.get<IGeneralConfig>('general').baseUrlApi}/v1/auth/signin`,
					user_signup: `${this.cfgService.get<IGeneralConfig>('general').baseUrlApi}/v1/auth/signup`,
					user_signout: `${this.cfgService.get<IGeneralConfig>('general').baseUrlApi}/v1/auth/signout`,
					refresh_access_token: `${this.cfgService.get<IGeneralConfig>('general').baseUrlApi}/v1/auth/refresh`,
				},
			},
		};
	}
}
