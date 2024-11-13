// src/user-activity/user-activity.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityLog } from './entities/user-activity-log.entity';
import { PaginatedActivityLogs } from './user-activity-log.types';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivityLog)
    private readonly activityLogRepository: Repository<UserActivityLog>,
  ) {}

  async logActivity(
    userId: number,
    activityType: string,
    description: string,
    createdBy: string,
  ): Promise<void> {
    try {
      const logEntry = this.activityLogRepository.create({
        userId,
        activityType,
        description,
        createdBy,
      });
      await this.activityLogRepository.save(logEntry);
    } catch (error) {
      throw new InternalServerErrorException('Failed to log user activity');
    }
  }

  async findAll(filters: {
    page?: number;
    limit?: number;
    activityType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedActivityLogs> {
    const { page = 1, limit = 10, activityType, startDate, endDate } = filters;
    const query = this.activityLogRepository.createQueryBuilder('log');

    if (activityType) {
      query.andWhere('log.activityType = :activityType', { activityType });
    }

    if (startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate });
    }

    const [logs, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      logs,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
