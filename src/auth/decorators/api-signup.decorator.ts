import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSignup() {
  return applyDecorators(
    ApiOperation({ summary: 'User Signup' }),
    ApiResponse({ status: 201, description: 'User successfully signed up.' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
}
