import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json().catch(() => ({}));
  const eventName = String(body.eventName || "unknown").slice(0, 80);
  await trackEvent({
    eventName,
    userId: session?.id,
    pageUrl: body.pageUrl ? String(body.pageUrl).slice(0, 500) : undefined,
    referrer: body.referrer ? String(body.referrer).slice(0, 500) : undefined,
    userAgent: req.headers.get("user-agent"),
    properties: typeof body.properties === "object" ? body.properties : undefined,
  });
  return NextResponse.json({ ok: true });
}
