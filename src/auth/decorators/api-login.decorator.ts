import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'User Login' }),
    ApiResponse({ status: 200, description: 'User successfully logged in.' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
