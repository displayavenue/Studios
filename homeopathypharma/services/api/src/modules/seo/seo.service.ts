import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SeoService {
  async getSitemap(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SeoService.getSitemap is not implemented');
  }

  async getRobots(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SeoService.getRobots is not implemented');
  }

  async getMetadata(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SeoService.getMetadata is not implemented');
  }

  async triggerReindex(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SeoService.triggerReindex is not implemented');
  }
}
