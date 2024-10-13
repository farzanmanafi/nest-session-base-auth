import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiRequestPasswordReset() {
  return applyDecorators(
    ApiOperation({ summary: 'Request password reset link' }),
    ApiResponse({
      status: 200,
      description: 'Password reset link sent successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'User with this email does not exist',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
