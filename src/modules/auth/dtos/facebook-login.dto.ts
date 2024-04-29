import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FacebookLoginDto {
	@IsNotEmpty()
	@IsString()
	facebookId: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(30, {
		message:
			'The username is too long. Please enter a user name no longer than 30 characters.',
	})
	username: string;

	@IsNotEmpty()
	@IsString()
	profilePhoto: string;
}
