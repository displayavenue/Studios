import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { GlobalRole } from "@prisma/client";
import { prisma } from "./db";
import { Permission, roleHasPermission } from "./rbac";

const COOKIE = "da_os_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "displayavenue-os-dev-jwt-change-me",
);

export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  globalRole: GlobalRole;
  organizationId?: string | null;
  sessionId: string;
};

export class AuthError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(params: {
  userId: string;
  organizationId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  const session = await prisma.session.create({
    data: {
      userId: params.userId,
      organizationId: params.organizationId || null,
      tokenHash,
      expiresAt,
      ip: params.ip || null,
      userAgent: params.userAgent || null,
    },
  });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: params.userId } });
  const jwt = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    globalRole: user.globalRole,
    organizationId: params.organizationId || null,
    sessionId: session.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(JWT_SECRET);

  return { jwt, raw, session, user };
}

export async function readSessionFromRequest(req?: Request): Promise<AuthSession | null> {
  let token: string | undefined;
  if (req) {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
    token = match?.[1] || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  } else {
    const jar = await cookies();
    token = jar.get(COOKIE)?.value;
  }
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId || !payload.sessionId) return null;
    const session = await prisma.session.findUnique({
      where: { id: String(payload.sessionId) },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      globalRole: payload.globalRole as GlobalRole,
      organizationId: (payload.organizationId as string) || null,
      sessionId: String(payload.sessionId),
    };
  } catch {
    return null;
  }
}

export async function requireUser(req?: Request): Promise<AuthSession> {
  const session = await readSessionFromRequest(req);
  if (!session) throw new AuthError();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.isActive) throw new AuthError();
  return session;
}

export async function requirePermission(permission: Permission, req?: Request) {
  const session = await requireUser(req);
  if (!roleHasPermission(session.globalRole, permission)) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }
  return session;
}

/**
 * Enforce tenant isolation. Super-admins may pass any orgId.
 * Everyone else must have an ACTIVE membership on that org.
 */
export async function requireOrgAccess(
  organizationId: string,
  permission: Permission,
  req?: Request,
) {
  const session = await requirePermission(permission, req);

  if (session.globalRole === "SUPER_ADMIN" || session.globalRole === "ADMIN") {
    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new ForbiddenError("Organization not found");
    return { session, organization: org, membershipRole: session.globalRole as GlobalRole };
  }

  const membership = await prisma.membership.findUnique({
    where: {
      organizationId_userId: { organizationId, userId: session.userId },
    },
    include: { organization: true },
  });

  if (!membership || membership.status !== "ACTIVE") {
    throw new ForbiddenError("No access to this organization");
  }
  if (!roleHasPermission(membership.role, permission)) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }

  return { session, organization: membership.organization, membershipRole: membership.role };
}

export function sessionCookieOptions(jwt: string) {
  return {
    name: COOKIE,
    value: jwt,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export { COOKIE as SESSION_COOKIE };
