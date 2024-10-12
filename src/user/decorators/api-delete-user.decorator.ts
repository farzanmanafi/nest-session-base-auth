import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a user by ID' }),
    ApiResponse({ status: 200, description: 'User successfully deleted' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}
