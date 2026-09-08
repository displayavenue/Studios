import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listUserReports } from "@/services/report/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    const reports = await listUserReports(session.id);
    return NextResponse.json({ reports });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  return GET();
}
