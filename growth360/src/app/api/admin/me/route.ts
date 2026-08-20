import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await requireAdmin(req);
    const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
    return jsonOk({ email: admin?.email, name: admin?.name, role: admin?.role });
  } catch (err) {
    return handleApiError(err);
  }
}
