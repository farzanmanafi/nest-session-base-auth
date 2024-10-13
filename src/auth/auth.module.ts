import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Import UserModule to access UserRepository
import { EmailModule } from 'src/shared/module/mail/email.module';

@Module({
  imports: [UserModule, EmailModule], // Use the UserModule, which already provides UserRepository
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
