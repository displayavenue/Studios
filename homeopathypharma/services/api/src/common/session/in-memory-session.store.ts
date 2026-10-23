import { Injectable } from '@nestjs/common';
import {
  SessionData,
  SessionStore,
} from './session-store.interface.js';

/**
 * In-memory Redis session store stub for local development.
 * Replace with RedisSessionStore backed by ioredis.
 */
@Injectable()
export class InMemorySessionStore extends SessionStore {
  private readonly sessions = new Map<string, SessionData>();

  async getSession(sessionId: string): Promise<SessionData | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  async setSession(
    sessionId: string,
    data: SessionData,
    _ttlSeconds: number,
  ): Promise<void> {
    this.sessions.set(sessionId, data);
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async refreshSession(sessionId: string, ttlSeconds: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    this.sessions.set(sessionId, session);
  }
}
