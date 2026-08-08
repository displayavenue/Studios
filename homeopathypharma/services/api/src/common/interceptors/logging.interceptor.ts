import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { StructuredLogger } from '../../observability/structured-logger.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const start = Date.now();
    const correlationId =
      (request.headers['x-correlation-id'] as string | undefined) ??
      (request.headers['x-request-id'] as string | undefined);

    return next.handle().pipe(
      tap(() => {
        this.logger.info('Request completed', {
          correlationId,
          method: request.method,
          path: request.url,
          durationMs: Date.now() - start,
        });
      }),
    );
  }
}
