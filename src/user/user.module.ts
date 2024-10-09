import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register UserRepository here
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], // Export TypeOrmModule to allow other modules to use UserRepository
})
export class UserModule {}
