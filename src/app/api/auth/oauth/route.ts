import { NextRequest, NextResponse } from "next/server";
import { mockGoogleLogin } from "@/lib/auth-otp";
import { trackEvent } from "@/lib/analytics";
import { useMockProviders } from "@/config/site";

/** Google OAuth entry — uses mock session when Google keys / mocks apply. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const provider = String(body.provider || "google");

  if (provider === "apple") {
    return NextResponse.json(
      {
        error: "APPLE_COMING_SOON",
        message: "Apple Sign In will be enabled after App Store credentials are configured.",
      },
      { status: 501 },
    );
  }

  if (!useMockProviders() && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error: "USE_REDIRECT",
        message: "Configure full Google OAuth redirect flow for production.",
        redirect: "/api/auth/callback/google",
      },
      { status: 501 },
    );
  }

  const user = await mockGoogleLogin();
  await trackEvent({ eventName: "oauth_google_mock", userId: user.id });
  return NextResponse.json({ ok: true, user, mock: true });
}
