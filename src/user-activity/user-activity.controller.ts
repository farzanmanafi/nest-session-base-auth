import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { RolesGuard } from '../shared/guard/roles.guard';
import { LogActivity } from './decorators/log-activity.decorator';
import { PaginatedActivityLogs } from './user-activity-log.types';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiGetActivityLogs } from './decorators/api-get-activity-logs.decorator';

@ApiTags('User Activity')
@Controller('admin/user-activity')
@UseGuards(RolesGuard) // Ensure only authorized users can access this route
@ApiBearerAuth() // Swagger will prompt for a bearer token if authentication is enabled
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get()
  @LogActivity()
  @ApiGetActivityLogs() // Use the custom Swagger decorator
  async getActivityLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('activityType') activityType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PaginatedActivityLogs> {
    try {
      const filters = { page, limit, activityType, startDate, endDate };
      const logs = await this.userActivityService.findAll(filters);
      return logs;
    } catch (error) {
      throw new HttpException(
        'Could not retrieve activity logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
