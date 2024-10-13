import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiEnableTwoFactor() {
  return applyDecorators(
    ApiOperation({ summary: 'Enable Two-Factor Authentication (2FA)' }),
    ApiResponse({
      status: 200,
      description: '2FA enabled successfully, QR Code URL returned.',
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to enable 2FA. User not found.',
    }),
    ApiResponse({ status: 401, description: 'Enabling 2FA failed.' }),
  );
}
