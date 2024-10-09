import {
  Controller,
  Post,
  Body,
  Session,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    await this.authService.signUp(authCredentialsDto);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.validateUser(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    session.userId = user.id;
    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.userId = null;
    return { message: 'Logged out successfully' };
  }
}
