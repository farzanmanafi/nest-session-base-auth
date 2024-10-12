import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export function ApiFindUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve a user by ID' }),
    ApiResponse({ status: 200, description: 'User found', type: User }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}
