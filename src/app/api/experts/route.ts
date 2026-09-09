import { NextRequest, NextResponse } from "next/server";
import { listPublicExperts, seedSampleExperts } from "@/services/experts/service";
import { getSession } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const onlineOnly = searchParams.get("onlineOnly") === "1";

  const experts = await listPublicExperts({ category, q, onlineOnly });
  const live = experts.filter((e) => e.source === "live").length;
  const sample = experts.filter((e) => e.source === "sample").length;

  return NextResponse.json({
    experts,
    meta: { live, sample, total: experts.length },
  });
}

/** Admin/ops: ensure sample experts exist in DB. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.action !== "seed-samples") {
    return NextResponse.json({ error: "UNKNOWN_ACTION" }, { status: 400 });
  }
  const result = await seedSampleExperts();
  return NextResponse.json({ ok: true, ...result });
}
