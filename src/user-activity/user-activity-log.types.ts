import { ApiProperty } from '@nestjs/swagger';
import { UserActivityLog } from './entities/user-activity-log.entity';

export class PaginatedActivityLogs {
  @ApiProperty({
    type: [UserActivityLog],
    description: 'Array of activity log entries',
  })
  logs: UserActivityLog[];

  @ApiProperty({ description: 'Total number of activity log entries' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
