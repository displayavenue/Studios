import type { Role } from "@homeopathypharma/config";

/**
 * Server session payload stored in Redis/database after authentication.
 * Roles and permissions are authoritative — never mirror client JWT claims blindly.
 */
export interface SessionUser {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string;
  avatarUrl: string | null;
  /** Assigned by server from database — NEVER trust client role flags. */
  role: Role;
  /** Resolved permission set at login time; refresh on role change. */
  permissions: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
  /** IP at login for anomaly detection — not used for authorization. */
  loginIp: string | null;
  userAgent: string | null;
}

export interface AuthenticatedRequest {
  session: SessionData;
}

export type SessionStatus = "active" | "expired" | "revoked" | "invalid";

export interface SessionLookupResult {
  status: SessionStatus;
  session: SessionData | null;
}

/** Minimal guest session for cart merge flows. */
export interface GuestSession {
  cartToken: string;
  expiresAt: number;
}
