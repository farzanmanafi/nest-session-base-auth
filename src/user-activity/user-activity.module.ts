// src/user-activity/user-activity.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { UserActivityLog } from './entities/user-activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivityLog])],
  providers: [UserActivityService],
  controllers: [UserActivityController],
  exports: [UserActivityService], // Export service if needed elsewhere
})
export class UserActivityModule {}
