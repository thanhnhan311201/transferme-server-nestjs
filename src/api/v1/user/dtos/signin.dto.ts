import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message:
      'The password is too short. Please enter a password at least 8 characters.',
  })
  password: string;
}
