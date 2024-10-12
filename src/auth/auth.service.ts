import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthSignupDto } from './dto/auth-signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(authSignupDto: AuthSignupDto): Promise<void> {
    const { username, email, password } = authSignupDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
  }

  async login(
    authLoginDto: AuthLoginDto,
    session: Record<string, any>,
  ): Promise<{ message: string }> {
    const user = await this.validateUser(
      authLoginDto.email,
      authLoginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Store the user ID in the session
    session.userId = user.id;

    return { message: 'Logged in successfully' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async logout(session: Record<string, any>): Promise<{ message: string }> {
    // Clear the session
    session.userId = null; // or delete session.userId;
    return { message: 'Logged out successfully' };
  }
}
