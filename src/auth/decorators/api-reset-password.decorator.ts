import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using token' }),
    ApiResponse({
      status: 200,
      description: 'Password has been reset successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid or expired password reset token',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
