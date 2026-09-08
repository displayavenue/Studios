import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { hasPermission, type Permission, isAdminRole } from "@/lib/rbac";

const COOKIE_NAME = "velora_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET || "velora-dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  firstName?: string | null;
  lastName?: string | null;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      role: payload.role as Role,
      firstName: (payload.firstName as string) || null,
      lastName: (payload.lastName as string) || null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (!isAdminRole(session.role)) throw new Error("FORBIDDEN");
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAdmin();
  if (!hasPermission(session.role, permission)) throw new Error("FORBIDDEN");
  return session;
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (existing) throw new Error("EMAIL_EXISTS");

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role ?? Role.CUSTOMER,
      profile: {
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      },
    },
    include: { profile: true },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { profile: true },
  });
  if (!user || !user.passwordHash || !user.isActive) throw new Error("INVALID_CREDENTIALS");

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
  };

  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return sessionUser;
}

export async function logoutUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => undefined);
  }
  await clearSessionCookie();
}

/** True when Supabase credentials are configured. Otherwise local auth is used. */
export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
