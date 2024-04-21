import { Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { STATUS } from '../common/types/status-code.type';
import { ConfigService } from '@nestjs/config';

import { Public } from '../common/decorators';

@Controller()
export class HATEOASController {
  constructor(private cfgService: ConfigService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getApiLinks() {
    return {
      status: STATUS.SUCCESS,
      data: {
        apis: {
          user_signin: `${this.cfgService.get<string>('BASE_URL_API')}/v1/auth/signin`,
          user_signup: `${this.cfgService.get<string>('BASE_URL_API')}/v1/auth/signup`,
          user_signout: `${this.cfgService.get<string>('BASE_URL_API')}/v1/auth/signout`,
          refresh_access_token: `${this.cfgService.get<string>('BASE_URL_API')}/v1/auth/refresh`,
        },
      },
    };
  }
}
