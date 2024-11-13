import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({
    description: 'Unique username of the user',
    example: 'john_doe',
  })
  username: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john@example.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Hashed password of the user',
    example: 'hashed_password_string',
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Token for email verification, if applicable',
    example: 'verification_token_123',
    required: false,
  })
  verificationToken: string; // Token for email verification

  @Column({ default: false })
  @ApiProperty({
    description: 'Indicates whether the user email is verified',
    example: false,
  })
  isVerified: boolean; // Flag to check if the email is verified

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty({
    description: 'Role of the user in the system',
    example: UserRole.USER,
    enum: UserRole,
  })
  role: UserRole; // Role of the user

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Token for password reset, if applicable',
    example: 'reset_token_456',
    required: false,
  })
  resetPasswordToken: string; // Token for password reset

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'Expiration date for the password reset token',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  resetPasswordExpires: Date; // Expiry date for the password reset token

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Secret key for two-factor authentication (2FA)',
    example: '2FA_secret_789',
    required: false,
  })
  twoFactorSecret: string; // Secret for 2FA

  @Column({ default: false })
  @ApiProperty({
    description: 'Indicates whether two-factor authentication (2FA) is enabled',
    example: false,
  })
  isTwoFactorEnabled: boolean; // Whether 2FA is enabled
}
