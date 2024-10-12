import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'The new username of the user',
    example: 'john_doe_updated',
  })
  @IsString()
  @IsOptional() // Mark the field as optional
  username?: string;

  @ApiPropertyOptional({
    description: 'The new email address of the user',
    example: 'john_updated@example.com',
  })
  @IsEmail()
  @IsOptional() // Mark the field as optional
  email?: string;

  @ApiPropertyOptional({
    description: 'The new password of the user (minimum 6 characters)',
    example: 'newstrongpassword123',
  })
  @MinLength(6)
  @IsOptional() // Mark the field as optional
  password?: string;
}
