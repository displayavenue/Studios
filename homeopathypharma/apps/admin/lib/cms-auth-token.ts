import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "hp_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12; // 12h

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SSH_PASS || "hp-admin-dev-secret-change-me";
}

export function getExpectedAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createAdminSessionToken(email = "admin@homeopathypharma.com"): string {
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const body = Buffer.from(JSON.stringify({ email, exp, role: "super-admin" })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): { email: string; role: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      email: string;
      exp: number;
      role: string;
    };
    if (!data.exp || data.exp < Date.now()) return null;
    return { email: data.email, role: data.role };
  } catch {
    return null;
  }
}
