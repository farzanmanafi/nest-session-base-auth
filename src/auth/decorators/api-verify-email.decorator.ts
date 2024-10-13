import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify user email address' }),
    ApiResponse({ status: 200, description: 'Email verified successfully' }),
    ApiResponse({ status: 400, description: 'Invalid verification token' }),
    ApiResponse({
      status: 404,
      description: 'Verification token not found or already used',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Verification failed',
    }),
  );
}
