import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_BYTES = 32;
const DEFAULT_TTL_SECONDS = 60 * 60; // 1 hour

export interface CsrfTokenPayload {
  /** Opaque token value — send in `x-csrf-token` header on state-changing requests. */
  token: string;
  /** Unix epoch seconds when the token expires. */
  expiresAt: number;
}

export interface CreateCsrfTokenOptions {
  /** HMAC secret — use a dedicated CSRF secret or session signing key from env. */
  secret: string;
  /** Optional session or user identifier bound into the token. */
  sessionId?: string;
  /** Token lifetime in seconds (default 3600). */
  ttlSeconds?: number;
}

export interface VerifyCsrfTokenOptions {
  secret: string;
  sessionId?: string;
  /** Reject tokens past this unix epoch second (default: now). */
  nowSeconds?: number;
}

/**
 * Create a server-side CSRF token for cookie-authenticated sessions.
 *
 * **Contract:** All state-changing HTTP requests (POST, PUT, PATCH, DELETE) that
 * authenticate via session cookie MUST include the token in the `x-csrf-token`
 * header. SameSite cookies alone are insufficient for admin/doctor surfaces.
 */
export function createCsrfToken(options: CreateCsrfTokenOptions): CsrfTokenPayload {
  const { secret, sessionId, ttlSeconds = DEFAULT_TTL_SECONDS } = options;
  if (!secret) {
    throw new Error("CSRF secret is required");
  }

  const nonce = randomBytes(TOKEN_BYTES).toString("base64url");
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sessionPart = sessionId ?? "";
  const message = `${nonce}.${expiresAt}.${sessionPart}`;
  const signature = signMessage(message, secret);
  const token = `${message}.${signature}`;

  return { token, expiresAt };
}

/**
 * Verify a CSRF token from the `x-csrf-token` request header.
 * Returns true when valid and not expired; false otherwise (does not throw).
 */
export function verifyCsrfToken(
  token: string | undefined | null,
  options: VerifyCsrfTokenOptions,
): boolean {
  if (!token?.trim()) {
    return false;
  }

  const { secret, sessionId, nowSeconds = Math.floor(Date.now() / 1000) } = options;
  if (!secret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const [nonce, expiresAtStr, sessionPart, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!nonce || !Number.isFinite(expiresAt) || !signature) {
    return false;
  }

  if (expiresAt < nowSeconds) {
    return false;
  }

  const expectedSession = sessionId ?? "";
  if (sessionPart !== expectedSession) {
    return false;
  }

  const message = `${nonce}.${expiresAtStr}.${sessionPart}`;
  const expectedSignature = signMessage(message, secret);

  try {
    return timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8"),
    );
  } catch {
    return false;
  }
}

function signMessage(message: string, secret: string): string {
  return createHmac("sha256", secret).update(message).digest("base64url");
}
