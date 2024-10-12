import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user. Minimum length is 6 characters.',
    example: 'strongpassword123',
  })
  @MinLength(6)
  password: string;
}
