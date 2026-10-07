import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return { status: 'ok', service: '@homeopathypharma/api', timestamp: new Date().toISOString() };
  }

  ready() {
    return { status: 'ready', checks: { api: 'ok', redis: 'stub', database: 'stub' } };
  }

  live() {
    return { status: 'alive' };
  }
}
