import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createReportOrder } from "@/services/order/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
    }

    const body = await req.json();

    if (body.productSlug && body.birthDetails) {
      const result = await createReportOrder({
        userId: session.id,
        productSlug: String(body.productSlug),
        birthDetails: body.birthDetails,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "CHECKOUT_FAILED" },
      { status: 400 },
    );
  }
}
