import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "growth360-dev-jwt-secret-change-in-production",
);

export type AdminSession = {
  adminId: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.adminId || !payload.email) return null;
    return {
      adminId: String(payload.adminId),
      email: String(payload.email),
      role: String(payload.role || "admin"),
    };
  } catch {
    return null;
  }
}

export async function getAdminFromCookies(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get("g360_admin")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin(req?: Request | NextRequest): Promise<AdminSession> {
  let token: string | undefined;
  if (req) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)g360_admin=([^;]+)/);
    token =
      match?.[1] ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      undefined;
    if ("cookies" in req && typeof req.cookies?.get === "function") {
      token = req.cookies.get("g360_admin")?.value || token;
    }
  } else {
    const jar = await cookies();
    token = jar.get("g360_admin")?.value;
  }
  if (!token) throw new AuthError("Unauthorized");
  const session = await verifyAdminToken(token);
  if (!session) throw new AuthError("Unauthorized");
  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin || !admin.isActive) throw new AuthError("Unauthorized");
  return session;
}

export class AuthError extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
