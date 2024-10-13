import {
  Controller,
  Post,
  Body,
  Session,
  UnauthorizedException,
  HttpCode,
  ConflictException,
  Query,
  Get,
  NotFoundException,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { ApiResetContentResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiSignup } from './decorators/api-signup.decorator';
import { ApiLogin } from './decorators/api-login.decorator';
import { ApiLogout } from './decorators/api-logout.decorator';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResetPassword } from './decorators/api-reset-password.decorator';
import { ApiRequestPasswordReset } from './decorators/api-request-password-reset.decorator';
import { ApiVerifyEmail } from './decorators/api-verify-email.decorator';
import { ApiDisableTwoFactor } from './decorators/apo-disable-two-factor.decorator';
import { ApiEnableTwoFactor } from './decorators/api-enable-two-factor.decorator';
import { ApiVerifyTwoFactor } from './decorators/api-verify-two-factor.decorator';
import { ApiLoginWithTwoFactor } from './decorators/api-login-with-two-factor.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiSignup()
  async signUp(@Body() authSignupDto: AuthSignupDto) {
    try {
      await this.authService.signUp(authSignupDto);
      return { message: 'User registered successfully' };
    } catch (error) {
      // Handle specific error types
      if (error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      }
      throw new UnauthorizedException('Could not register user');
    }
  }

  @Post('login')
  @ApiLogin() // Apply the login decorator
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      return await this.authService.login(authLoginDto, session); // Call the login method from AuthService
    } catch (error) {
      // Handle specific error types
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('logout')
  @HttpCode(200) // Set HTTP status code to 200
  @ApiLogout() // Apply the logout decorator
  async logout(
    @Session() session: Record<string, any>,
  ): Promise<{ message: string }> {
    try {
      await this.authService.logout(session); // Call the logout method from AuthService
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Logout failed');
    }
  }

  @Get('verify-email')
  @ApiVerifyEmail()
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.authService.verifyEmail(token);
      return { message: 'Email verified successfully. You can now log in.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Verification token is invalid or has already been used',
        );
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid verification token');
      }
      throw new UnauthorizedException('Email verification failed');
    }
  }

  @Post('request-password-reset')
  @ApiRequestPasswordReset()
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    try {
      await this.authService.requestPasswordReset(dto.email);
      return { message: 'Password reset link sent successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('User with this email does not exist');
      }
      throw new UnauthorizedException('Request password reset failed');
    }
  }

  @Post('reset-password')
  @ApiResetPassword()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(dto.token, dto.newPassword);
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Invalid or expired password reset token',
        );
      }
      throw new UnauthorizedException('Password reset failed');
    }
  }

  @Post('enable-2fa/:userId')
  @ApiEnableTwoFactor() // Decorator for enabling 2FA
  async enableTwoFactorAuthentication(@Param('userId') userId: number) {
    try {
      const result =
        await this.authService.enableTwoFactorAuthentication(userId);
      return { qrCodeUrl: result.qrCodeUrl };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Failed to enable 2FA. User not found.');
      }
      throw new UnauthorizedException('Enabling 2FA failed');
    }
  }

  @Post('verify-2fa/:userId')
  @ApiVerifyTwoFactor() // Decorator for verifying 2FA
  async verifyTwoFactorAuthentication(
    @Param('userId') userId: number,
    @Body('token') token: string,
  ) {
    try {
      const isVerified = await this.authService.verifyTwoFactorAuthentication(
        userId,
        token,
      );
      if (isVerified) {
        return { message: '2FA verified successfully' };
      }
      throw new UnauthorizedException('Invalid 2FA token');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'Invalid 2FA token or verification failed',
        );
      }
      throw new BadRequestException('2FA verification failed');
    }
  }

  @Post('login-2fa')
  @ApiLoginWithTwoFactor() // Decorator for logging in with 2FA
  async loginWith2FA(
    @Body() authLoginDto: AuthLoginDto,
    @Body('token') token: string,
    @Session() session: Record<string, any>,
  ) {
    try {
      return await this.authService.loginWith2FA(
        authLoginDto.email,
        authLoginDto.password,
        token,
        session,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials or 2FA token');
      }
      throw new BadRequestException('Login with 2FA failed');
    }
  }

  @Post('disable-2fa/:userId')
  @ApiDisableTwoFactor() // Decorator for disabling 2FA
  async disableTwoFactorAuthentication(@Param('userId') userId: number) {
    try {
      await this.authService.disableTwoFactorAuthentication(userId);
      return {
        message: 'Two-Factor Authentication has been disabled successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Failed to disable 2FA. User not found.');
      }
      throw new UnauthorizedException('Disabling 2FA failed');
    }
  }
}
