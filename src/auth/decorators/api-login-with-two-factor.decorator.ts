import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthLoginDto } from '../dto/auth-login.dto';

export function ApiLoginWithTwoFactor() {
  return applyDecorators(
    ApiOperation({ summary: 'Login with Two-Factor Authentication (2FA)' }),
    ApiBody({
      description: 'User login credentials with 2FA token',
      type: AuthLoginDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Logged in successfully with 2FA.',
    }),
    ApiResponse({ status: 400, description: 'Login with 2FA failed.' }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials or 2FA token.',
    }),
  );
}
