import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ConsultationsService {
  async bookConsultation(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ConsultationsService.bookConsultation is not implemented');
  }

  async listConsultations(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ConsultationsService.listConsultations is not implemented');
  }

  async getConsultation(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ConsultationsService.getConsultation is not implemented');
  }

  async cancelConsultation(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ConsultationsService.cancelConsultation is not implemented');
  }

  async joinConsultation(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ConsultationsService.joinConsultation is not implemented');
  }
}
