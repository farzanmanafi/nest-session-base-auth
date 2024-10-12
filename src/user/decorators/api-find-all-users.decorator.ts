import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve all users' }),
    ApiResponse({
      status: 200,
      description: 'List of all users',
      type: [User],
    }),
  );
}
