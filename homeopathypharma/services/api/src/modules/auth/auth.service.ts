import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  /**
   * TODO: Verify idToken with GoogleIdTokenVerifierImpl (google-auth-library).
   * OWASP A07 — never trust client-decoded JWT or user IDs; upsert User from verified sub/email.
   */
  async googleSignIn(_payload: { idToken: string }): Promise<Record<string, unknown>> {
    throw new NotImplementedException(
      'AuthService.googleSignIn — wire GoogleIdTokenVerifierImpl + session store',
    );
  }

  /** TODO: Rate-limit OTP requests; store hashed OTP with TTL; send via notification provider. */
  async requestOtp(_payload: { channel: string; address: string }): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.requestOtp — wire OTP provider + rate limits');
  }

  /** TODO: Constant-time OTP compare; rotate session on success; enforce MFA for privileged roles. */
  async verifyOtp(_payload: { address: string; code: string }): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.verifyOtp — wire OTP verification + session');
  }

  /** TODO: Revoke session in Redis + mark Session.revokedAt in PostgreSQL. */
  async logout(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.logout — wire session revocation');
  }

  /** TODO: Return Session rows for current user (device label, lastSeenAt, ipAddress). */
  async listSessions(): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.listSessions — wire Session query');
  }

  /** TODO: Revoke target session if owned by current user; audit forced logout. */
  async revokeSession(_sessionId: string): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.revokeSession — wire session revocation');
  }

  async login(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.login is not implemented');
  }

  async register(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.register is not implemented');
  }

  async refresh(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.refresh is not implemented');
  }

  async getMe(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.getMe is not implemented');
  }

  async forgotPassword(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.forgotPassword is not implemented');
  }

  async resetPassword(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.resetPassword is not implemented');
  }
}
