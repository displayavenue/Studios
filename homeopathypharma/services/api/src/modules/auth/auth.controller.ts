import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body?: unknown) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout(@Body() body?: unknown) {
    return this.authService.logout(body);
  }

  @Public()
  @Post('register')
  register(@Body() body?: unknown) {
    return this.authService.register(body);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() body?: unknown) {
    return this.authService.refresh(body);
  }

  @Get('me')
  getMe() {
    return this.authService.getMe();
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body?: unknown) {
    return this.authService.forgotPassword(body);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body?: unknown) {
    return this.authService.resetPassword(body);
  }

}
