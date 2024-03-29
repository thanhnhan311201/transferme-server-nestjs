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
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message:
      'The user name is too long. Please enter a user name no longer than 30 characters.',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message:
      'The password is too short. Please enter a password at least 8 characters.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message:
      'The confirm password is too short. Please enter a password at least 8 characters.',
  })
  confirmPassword: string;
}
