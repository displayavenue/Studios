import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyCsrfToken } from '@homeopathypharma/auth';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { AuthenticatedRequest } from './auth.guard.js';

const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Enforces CSRF token validation for cookie-authenticated state-changing requests.
 * Skips safe methods, unauthenticated requests, and @Public() routes (webhooks).
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const method = request.method.toUpperCase();

    if (SAFE_METHODS.has(method)) {
      return true;
    }

    const sessionId = request.cookies?.['session_id'] as string | undefined;
    if (!sessionId) {
      return true;
    }

    const secret = process.env.CSRF_SECRET ?? process.env.SESSION_SECRET;
    if (!secret) {
      throw new ForbiddenException('CSRF protection is not configured');
    }

    const token = request.headers[CSRF_HEADER] as string | undefined;
    const valid = verifyCsrfToken(token, { secret, sessionId });

    if (!valid) {
      throw new ForbiddenException(`Missing or invalid ${CSRF_HEADER} header`);
    }

    return true;
  }
}
