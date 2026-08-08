import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.login is not implemented');
  }

  async logout(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('AuthService.logout is not implemented');
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
