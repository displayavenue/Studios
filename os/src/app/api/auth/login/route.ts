import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  organizationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !user.passwordHash || !user.isActive) {
      return jsonError("Invalid credentials", 401);
    }
    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return jsonError("Invalid credentials", 401);

    let organizationId = body.organizationId || null;
    if (!organizationId) {
      const membership = await prisma.membership.findFirst({
        where: { userId: user.id, status: "ACTIVE" },
        orderBy: { createdAt: "asc" },
      });
      organizationId = membership?.organizationId || null;
    }

    const { jwt, session } = await createSession({
      userId: user.id,
      organizationId,
      ip: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await writeAudit({
      action: "auth.login",
      userId: user.id,
      organizationId,
      entity: "session",
      entityId: session.id,
      ip: req.headers.get("x-forwarded-for"),
    });

    const res = jsonOk({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        globalRole: user.globalRole,
      },
      organizationId,
    });
    const cookie = sessionCookieOptions(jwt);
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
