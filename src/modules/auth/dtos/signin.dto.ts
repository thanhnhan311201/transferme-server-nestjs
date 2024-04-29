import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8, {
		message:
			'The password is too short. Please enter a password at least 8 characters.',
	})
	password: string;
}
