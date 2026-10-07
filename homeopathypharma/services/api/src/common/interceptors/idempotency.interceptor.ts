import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { IDEMPOTENT_KEY } from '../decorators/idempotent.decorator.js';

/**
 * Idempotency interceptor for payment, order, and shipping routes.
 * Requires Idempotency-Key header; stores response snapshot in Redis (stub).
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly cache = new Map<
    string,
    { statusCode: number; body: unknown }
  >();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(
      IDEMPOTENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isIdempotent) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const idempotencyKey = request.headers['idempotency-key'] as
      | string
      | undefined;

    if (!idempotencyKey) {
      throw new ConflictException('Idempotency-Key header is required');
    }

    const cacheKey = `${request.method}:${request.path}:${idempotencyKey}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      response.status(cached.statusCode);
      return of(cached.body);
    }

    return next.handle().pipe(
      tap((body) => {
        this.cache.set(cacheKey, {
          statusCode: response.statusCode,
          body,
        });
        // TODO: persist to Redis with TTL for cross-instance idempotency
      }),
    );
  }
}
