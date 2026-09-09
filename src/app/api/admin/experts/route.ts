import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { adminListExperts, adminUpdateExpert, seedSampleExperts } from "@/services/experts/service";

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "experts.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const experts = await adminListExperts();
  return NextResponse.json({
    experts: experts.map((e) => ({
      id: e.id,
      slug: e.slug,
      displayName: e.displayName,
      email: e.user.email,
      pricePerMin: Number(e.pricePerMin ?? 0),
      isOnline: e.isOnline,
      isActive: e.isActive,
      isVerified: e.isVerified,
      isSample: e.isSample,
      badge: e.badge,
      createdAt: e.createdAt,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "experts.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  if (body.action === "seed-samples") {
    const result = await seedSampleExperts();
    return NextResponse.json({ ok: true, ...result });
  }
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
  const updated = await adminUpdateExpert(id, {
    isVerified: typeof body.isVerified === "boolean" ? body.isVerified : undefined,
    isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
    isOnline: typeof body.isOnline === "boolean" ? body.isOnline : undefined,
    pricePerMin: typeof body.pricePerMin === "number" ? body.pricePerMin : undefined,
    badge: typeof body.badge === "string" ? body.badge : undefined,
  });
  return NextResponse.json({ ok: true, id: updated.id });
}
