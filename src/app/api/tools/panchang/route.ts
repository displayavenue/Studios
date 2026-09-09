import { NextRequest, NextResponse } from "next/server";
import { computePanchang } from "@/lib/vedic/panchang";

export async function GET(req: NextRequest) {
  const date =
    req.nextUrl.searchParams.get("date") ||
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  }
  try {
    const panchang = computePanchang(date);
    return NextResponse.json({ panchang });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PANCHANG_FAILED" },
      { status: 500 },
    );
  }
}
