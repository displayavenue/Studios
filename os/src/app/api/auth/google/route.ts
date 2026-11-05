import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  googleOAuthConfigured,
} from "@/lib/googleAuth";
import { jsonError } from "@/lib/api";

export async function GET(req: NextRequest) {
  if (!googleOAuthConfigured()) {
    return jsonError(
      "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      503,
    );
  }

  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/growth360";
  const state = createOAuthState(returnTo.startsWith("/") ? returnTo : "/growth360");
  const url = buildGoogleAuthUrl(state);
  return NextResponse.redirect(url);
}
