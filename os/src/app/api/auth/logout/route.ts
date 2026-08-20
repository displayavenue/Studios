import { prisma } from "@/lib/db";
import { readSessionFromRequest, SESSION_COOKIE } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { handleApiError, jsonOk } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const session = await readSessionFromRequest(req);
    if (session) {
      await prisma.session.deleteMany({ where: { id: session.sessionId } });
      await writeAudit({
        action: "auth.logout",
        userId: session.userId,
        organizationId: session.organizationId,
        entity: "session",
        entityId: session.sessionId,
      });
    }
    const res = jsonOk({ loggedOut: true });
    res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
