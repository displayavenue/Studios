import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming =
      (req.headers['x-correlation-id'] as string | undefined) ??
      (req.headers['x-request-id'] as string | undefined);

    const correlationId = incoming ?? uuidv4();
    (req as Request & { correlationId: string }).correlationId = correlationId;
    req.headers['x-correlation-id'] = correlationId;
    req.headers['x-request-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    res.setHeader('x-request-id', correlationId);
    next();
  }
}
