import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user by ID' }),
    ApiResponse({
      status: 200,
      description: 'User successfully updated',
      type: User,
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
}
