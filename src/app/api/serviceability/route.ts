import { NextRequest, NextResponse } from "next/server";
import { checkServiceability } from "@/providers/shipping";

export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode") || "";
  const result = await checkServiceability(pincode);
  return NextResponse.json(result);
}
