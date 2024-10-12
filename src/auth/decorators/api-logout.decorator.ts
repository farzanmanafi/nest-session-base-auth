import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'User Logout' }),
    ApiResponse({ status: 200, description: 'User successfully logged out.' }),
  );
}
