import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDisableTwoFactor() {
  return applyDecorators(
    ApiOperation({ summary: 'Disable Two-Factor Authentication (2FA)' }),
    ApiResponse({
      status: 200,
      description: 'Two-Factor Authentication has been disabled successfully.',
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to disable 2FA. User not found.',
    }),
    ApiResponse({ status: 401, description: 'Disabling 2FA failed.' }),
  );
}
