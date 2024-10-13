import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password to be set',
    example: 'newstrongpassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({
    description: 'The reset token sent via email',
    example: 'reset-token-123456',
  })
  @IsString()
  token: string;
}
