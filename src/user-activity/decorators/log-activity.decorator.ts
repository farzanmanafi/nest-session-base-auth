// src/user-activity/decorators/log-activity.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const LOG_ACTIVITY_KEY = 'logActivity';
export const LogActivity = () => SetMetadata(LOG_ACTIVITY_KEY, true);
