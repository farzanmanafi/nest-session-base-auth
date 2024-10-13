import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthSignupDto } from './dto/auth-signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/shared/module/mail/email.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/user/enum/user-role.enum';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(authSignupDto: AuthSignupDto): Promise<void> {
    const { username, email, password, role } = authSignupDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole =
      role === UserRole.ADMIN ? UserRole.USER : role || UserRole.USER; // Prevent users from assigning themselves as admin

    const verificationToken = uuidv4(); // Generate a unique token

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false, // Set to false until the user verifies their email
      role: userRole,
    });

    await this.userRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(email, verificationToken);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification

    await this.userRepository.save(user);
  }

  async login(
    authLoginDto: AuthLoginDto,
    session: Record<string, any>,
  ): Promise<{ message: string }> {
    const user = await this.validateUser(
      authLoginDto.email,
      authLoginDto.password,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified)
      throw new UnauthorizedException('Email is not verified');

    session.userId = user.id;
    return { message: 'Logged in successfully' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async logout(session: Record<string, any>): Promise<{ message: string }> {
    session.userId = null;
    return { message: 'Logged out successfully' };
  }

  // Method to request a password reset
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate reset token and set its expiry (e.g., 1 hour from now)
    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.save(user);

    // Send email with the reset link
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  // Method to reset the password using the token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
  }

  // Method to enable 2FA
  async enableTwoFactorAuthentication(
    userId: number,
  ): Promise<{ qrCodeUrl: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate a secret for 2FA
    const secret = speakeasy.generateSecret({
      name: 'MyAppName',
      length: 20,
    });

    // Save the secret in the user's record
    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    // Generate a QR code to be scanned by the user's authenticator app
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    return { qrCodeUrl };
  }

  // Method to verify 2FA code
  async verifyTwoFactorAuthentication(
    userId: number,
    token: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA is not enabled for this user');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    return verified;
  }

  // Method to disable 2FA
  async disableTwoFactorAuthentication(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.twoFactorSecret = null;
    user.isTwoFactorEnabled = false;
    await this.userRepository.save(user);
  }

  // Update login to check for 2FA
  async loginWith2FA(
    email: string,
    password: string,
    token: string,
    session: Record<string, any>,
  ): Promise<{ message: string }> {
    const user = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified)
      throw new UnauthorizedException('Email is not verified');

    if (user.isTwoFactorEnabled) {
      const is2FAVerified = await this.verifyTwoFactorAuthentication(
        user.id,
        token,
      );
      if (!is2FAVerified) {
        throw new UnauthorizedException('Invalid 2FA token');
      }
    }

    session.userId = user.id;
    return { message: 'Logged in successfully' };
  }
}
