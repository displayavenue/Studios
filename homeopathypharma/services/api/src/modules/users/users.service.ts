import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  async listUsers(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('UsersService.listUsers is not implemented');
  }

  async getUser(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('UsersService.getUser is not implemented');
  }

  async updateUser(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('UsersService.updateUser is not implemented');
  }

  async deleteUser(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('UsersService.deleteUser is not implemented');
  }
}
