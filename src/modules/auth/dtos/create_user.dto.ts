import { Expose, plainToInstance } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsEmail()
	@Expose()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(30, {
		message:
			'The username is too long. Please enter a user name no longer than 30 characters.',
	})
	@Expose()
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8, {
		message:
			'The password is too short. Please enter a password at least 8 characters.',
	})
	@Expose()
	password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8, {
		message:
			'The confirm password is too short. Please enter a password at least 8 characters.',
	})
	@Expose()
	confirmPassword: string;

	static mapToDto<T>(this: new (...args: any[]) => T, obj: T): T {
		return plainToInstance(this, obj, { excludeExtraneousValues: true });
	}
}
