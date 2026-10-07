import { Module, Global } from '@nestjs/common';
import { StructuredLogger } from './structured-logger.service.js';

@Global()
@Module({
  providers: [StructuredLogger],
  exports: [StructuredLogger],
})
export class ObservabilityModule {}
