import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Rate limiting stub — replace with Redis-backed sliding window in production.
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly counters = new Map<string, { count: number; resetAt: number }>();
  private readonly windowMs = 60_000;
  private readonly maxRequests = 100;

  use(req: Request, res: Response, next: NextFunction): void {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const entry = this.counters.get(key);

    if (!entry || now > entry.resetAt) {
      this.counters.set(key, { count: 1, resetAt: now + this.windowMs });
      res.setHeader('X-RateLimit-Limit', String(this.maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(this.maxRequests - 1));
      return next();
    }

    entry.count += 1;
    const remaining = Math.max(0, this.maxRequests - entry.count);
    res.setHeader('X-RateLimit-Limit', String(this.maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (entry.count > this.maxRequests) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    next();
  }
}
