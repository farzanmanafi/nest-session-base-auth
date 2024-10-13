import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiVerifyTwoFactor() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify Two-Factor Authentication (2FA) Token' }),
    ApiResponse({ status: 200, description: '2FA verified successfully.' }),
    ApiResponse({ status: 400, description: '2FA verification failed.' }),
    ApiResponse({
      status: 401,
      description: 'Invalid 2FA token or verification failed.',
    }),
  );
}
