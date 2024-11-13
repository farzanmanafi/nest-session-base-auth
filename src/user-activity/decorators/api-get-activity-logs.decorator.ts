import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedActivityLogs } from '../user-activity-log.types';

export function ApiGetActivityLogs() {
  return applyDecorators(
    ApiTags('User Activity'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Fetch user activity logs' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Limit number of logs per page',
    }),
    ApiQuery({
      name: 'activityType',
      required: false,
      type: String,
      description: 'Filter by activity type',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Filter logs after a specific date (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      type: String,
      description: 'Filter logs before a specific date (YYYY-MM-DD)',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved activity logs',
      type: PaginatedActivityLogs,
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
