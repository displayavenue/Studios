export interface SessionUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface SessionData {
  user: SessionUser;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Redis session store interface — implement with ioredis in production.
 */
export abstract class SessionStore {
  abstract getSession(sessionId: string): Promise<SessionData | null>;
  abstract setSession(
    sessionId: string,
    data: SessionData,
    ttlSeconds: number,
  ): Promise<void>;
  abstract deleteSession(sessionId: string): Promise<void>;
  abstract refreshSession(sessionId: string, ttlSeconds: number): Promise<void>;
}

export const SESSION_STORE = Symbol('SESSION_STORE');
