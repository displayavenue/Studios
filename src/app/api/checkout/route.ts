import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createReportOrder } from "@/services/order/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    if (!body.productSlug || !body.birthDetails) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    if (!session && !body.guestEmail) {
      return NextResponse.json({ error: "EMAIL_REQUIRED", message: "Enter email to continue as guest." }, { status: 400 });
    }

    const result = await createReportOrder({
      userId: session?.id,
      guestEmail: session ? undefined : String(body.guestEmail || ""),
      productSlug: String(body.productSlug),
      birthDetails: body.birthDetails,
      partnerBirthDetails: body.partnerBirthDetails || null,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "CHECKOUT_FAILED" },
      { status: 400 },
    );
  }
}
