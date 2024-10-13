import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  verificationToken: string; // Token for email verification

  @Column({ default: false })
  isVerified: boolean; // Flag to check if the email is verified

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Default role
  })
  role: UserRole; // Role of the user
  @Column({ nullable: true })
  resetPasswordToken: string; // Token for password reset

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date; // Expiry date for the password reset token

  @Column({ nullable: true })
  twoFactorSecret: string; // Secret for 2FA

  @Column({ default: false })
  isTwoFactorEnabled: boolean; // Whether 2FA is enabled
}
