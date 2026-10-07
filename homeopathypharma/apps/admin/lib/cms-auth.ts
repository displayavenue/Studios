import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  getExpectedAdminPassword,
  verifyAdminSessionToken,
} from "./cms-auth-token";

export {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  getExpectedAdminPassword,
  verifyAdminSessionToken,
};

export async function readAdminSession() {
  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminSession() {
  const session = await readAdminSession();
  if (!session) {
    return { ok: false as const, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}
