// src/user-activity/middleware/user-activity.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserActivityService } from 'src/user-activity/user-activity.service';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(private readonly userActivityService: UserActivityService) {}

  use(req: any, res: any, next: () => void) {
    // Log the activity
    if (req.user) {
      this.userActivityService.logActivity(
        req.user.id, // Assume user ID is in req.user
        'USER_ACTION', // Define your own action types
        `User performed an action: ${req.originalUrl}`,
        req.user.username, // Assume username is in req.user
      );
    }
    next();
  }
}
