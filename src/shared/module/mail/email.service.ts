import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${this.configService.get<string>('SENDGRID_VERIFY_URL')}?token=${token}`;

    const msg = {
      to: email,
      from: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
      subject: 'Verify Your Email Address',
      text: `Please verify your email by clicking the link: ${verifyUrl}`,
      html: `<strong>Please verify your email by clicking the link: <a href="${verifyUrl}">Verify Email</a></strong>`,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;
    const msg = {
      to: email,
      from: 'noreply@example.com',
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    };

    await sgMail.send(msg);
  }
}
