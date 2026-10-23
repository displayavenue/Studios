import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Google sign-in — client sends ID token obtained from Google SDK over HTTPS.
   * Backend verifies signature/aud/iss/exp via google-auth-library; never trust client user IDs.
   */
  @Public()
  @Post('google')
  googleSignIn(@Body() body: { idToken: string }) {
    return this.authService.googleSignIn(body);
  }

  /** Request OTP for email or phone channel (rate-limited). */
  @Public()
  @Post('otp/request')
  requestOtp(@Body() body: { channel: string; address: string }) {
    return this.authService.requestOtp(body);
  }

  /** Verify OTP and establish session. */
  @Public()
  @Post('otp/verify')
  verifyOtp(@Body() body: { address: string; code: string }) {
    return this.authService.verifyOtp(body);
  }

  @Post('logout')
  logout(@Body() body?: unknown) {
    return this.authService.logout(body);
  }

  /** List active sessions for the authenticated user. */
  @Get('sessions')
  listSessions() {
    return this.authService.listSessions();
  }

  /** Revoke a specific session by ID. */
  @Delete('sessions/:id')
  revokeSession(@Param('id') sessionId: string) {
    return this.authService.revokeSession(sessionId);
  }

  @Public()
  @Post('login')
  login(@Body() body?: unknown) {
    return this.authService.login(body);
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
