import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	UseGuards,
} from '@nestjs/common';

// import { Serialize } from '@modules/common/interceptors';
import { CurrentUser, Public } from '@modules/common/decorators';
import { JwtRefreshTokenGuard } from '@modules/common/guards';
import { STATUS } from '@modules/common/types';
import { UserDto } from '@modules/user/dtos';
import {
	CreateUserDto,
	FacebookLoginDto,
	GitHubLoginDto,
	GoogleLoginDto,
	RefreshTokenDto,
	SigninDto,
	VerifyEmailDto,
} from './dtos';
import { IAuthService } from './interfaces';
import { ROUTES, SERVICES } from '@utils/constants.util';

@Controller(ROUTES.AUTH)
export class AuthController {
	constructor(
		@Inject(SERVICES.AUTH_SERVICE)
		private readonly authService: IAuthService,
	) {}

	@Public()
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() body: CreateUserDto) {
		await this.authService.signup(body);

		return { status: STATUS.SUCCESS };
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
	async logout(@CurrentUser() user: UserDto) {
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
	@Post('google')
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

	@Public()
	@Post('facebook')
	@HttpCode(HttpStatus.OK)
	async facebookLogin(@Body() body: FacebookLoginDto) {
		const token = await this.authService.facebookLogin(body);

		return { status: STATUS.SUCCESS, data: { ...token } };
	}
}
