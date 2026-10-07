import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SearchService {
  async search(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SearchService.search is not implemented');
  }

  async suggestions(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SearchService.suggestions is not implemented');
  }

  async facets(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('SearchService.facets is not implemented');
  }
}
