import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAdminToken, verifyPassword } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const admin = await prisma.admin.findUnique({ where: { email: body.email } });
    if (!admin || !admin.isActive) return jsonError("Invalid credentials", 401);
    const ok = await verifyPassword(body.password, admin.passwordHash);
    if (!ok) return jsonError("Invalid credentials", 401);

    const token = await createAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: "admin.login", entity: "admin", entityId: admin.id },
    });

    const res = jsonOk({ email: admin.email, name: admin.name, role: admin.role });
    res.cookies.set("g360_admin", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
