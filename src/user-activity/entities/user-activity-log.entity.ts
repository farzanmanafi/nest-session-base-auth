import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserActivityLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the activity log entry' })
  id: number;

  @Column()
  @ApiProperty({ description: 'ID of the user who performed the action' })
  userId: number;

  @Column()
  @ApiProperty({
    description:
      'Type of activity performed, e.g., LOGIN, PASSWORD_CHANGE, etc.',
  })
  activityType: string;

  @Column('text')
  @ApiProperty({ description: 'Detailed description of the activity' })
  description: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the activity log was created' })
  createdAt: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'User who created the log entry',
    nullable: true,
  })
  createdBy: string;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the log entry was deleted or last updated',
    nullable: true,
  })
  deletedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'User who deleted the log entry',
    nullable: true,
  })
  deletedBy: string;
}
