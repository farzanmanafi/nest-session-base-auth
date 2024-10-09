import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
