import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ShipmentsService {
  async createShipment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ShipmentsService.createShipment is not implemented');
  }

  async trackShipment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ShipmentsService.trackShipment is not implemented');
  }

  async cancelShipment(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ShipmentsService.cancelShipment is not implemented');
  }
}
