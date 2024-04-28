import { Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { STATUS } from '../common/types/status-code.type';
import { ConfigService } from '@nestjs/config';

import { Public } from '../common/decorators';

import IConfig, { IGeneralConfig } from 'config';

@Controller()
export class HATEOASController {
  // eslint-disable-next-line no-unused-vars
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
