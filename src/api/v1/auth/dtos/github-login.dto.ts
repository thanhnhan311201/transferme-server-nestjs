import { IsNotEmpty, IsString } from 'class-validator';

export class GitHubLoginDto {
  @IsNotEmpty()
  @IsString()
  authCode: string;
}
