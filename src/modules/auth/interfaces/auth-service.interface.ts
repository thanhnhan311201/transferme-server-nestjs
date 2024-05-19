import { CreateUserDto, FacebookLoginDto, SigninDto } from '../dtos';
import { UserDto } from '@modules/user/dtos';
import { Tokens } from '../types';

export interface IAuthService {
	genToken(userId: string, email: string): Promise<Tokens>;
	signup(payload: CreateUserDto): Promise<UserDto>;
	signin(payload: SigninDto): Promise<Tokens>;
	signout(userId: string): Promise<void>;
	refreshAccessToken(refreshToken: string): Promise<Tokens>;
	verifyEmail(email: string): Promise<boolean>;
	googleLogin(authCode: string): Promise<Tokens>;
	githubAuthentication(authCode: string): Promise<Tokens>;
	facebookLogin(payload: FacebookLoginDto): Promise<Tokens>;
	verifyAccessToken(token: string): Promise<UserDto>;
}
