import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: User,
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
}
