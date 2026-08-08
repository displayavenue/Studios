import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class DoctorsService {
  async getProfile(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('DoctorsService.getProfile is not implemented');
  }

  async updateProfile(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('DoctorsService.updateProfile is not implemented');
  }

  async getAvailability(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('DoctorsService.getAvailability is not implemented');
  }

  async setAvailability(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('DoctorsService.setAvailability is not implemented');
  }

  async listPatients(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('DoctorsService.listPatients is not implemented');
  }
}
