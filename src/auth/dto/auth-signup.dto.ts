import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsString()
  username: string;

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
