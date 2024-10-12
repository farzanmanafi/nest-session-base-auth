import {
  Controller,
  Post,
  Body,
  Session,
  Res,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiSignup } from './decorators/api-signup.decorator';
import { ApiLogin } from './decorators/api-login.decorator';
import { ApiLogout } from './decorators/api-logout.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiSignup()
  async signUp(@Body() authSignupDto: AuthSignupDto) {
    await this.authService.signUp(authSignupDto);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiLogin() // Apply the login decorator
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.login(authLoginDto, session); // Call the login method from AuthService
  }

  @Post('logout')
  @HttpCode(200) // Set HTTP status code to 200
  @ApiLogout() // Apply the logout decorator
  async logout(
    @Session() session: Record<string, any>,
  ): Promise<{ message: string }> {
    return this.authService.logout(session); // Call the logout method from AuthService
  }
}
