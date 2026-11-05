import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, sessionCookieOptions } from "@/lib/auth";
import { exchangeGoogleCode, getAppUrl, parseOAuthState } from "@/lib/googleAuth";
import { writeAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const appUrl = getAppUrl();
  try {
    const url = req.nextUrl;
    const err = url.searchParams.get("error");
    if (err) {
      return NextResponse.redirect(
        `${appUrl}/growth360?google_error=${encodeURIComponent(err)}`,
      );
    }

    const code = url.searchParams.get("code");
    const stateRaw = url.searchParams.get("state") || "";
    const state = parseOAuthState(stateRaw);
    if (!code || !state) {
      return NextResponse.redirect(`${appUrl}/growth360?google_error=invalid_state`);
    }

    const profile = await exchangeGoogleCode(code);
    if (profile.email_verified === false) {
      return NextResponse.redirect(`${appUrl}/growth360?google_error=email_unverified`);
    }

    let user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          passwordHash: null,
          globalRole: "CLIENT_USER",
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: profile.name || user.name,
          lastLoginAt: new Date(),
          isActive: true,
        },
      });
    }

    const { jwt, session } = await createSession({
      userId: user.id,
      organizationId: null,
      ip: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    await writeAudit({
      action: "auth.google_login",
      userId: user.id,
      entity: "session",
      entityId: session.id,
      ip: req.headers.get("x-forwarded-for"),
      after: { provider: "google", email: user.email },
    });

    const res = NextResponse.redirect(`${appUrl}${state.returnTo}`);
    const cookie = sessionCookieOptions(jwt);
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "google_failed";
    return NextResponse.redirect(
      `${appUrl}/growth360?google_error=${encodeURIComponent(message.slice(0, 120))}`,
    );
  }
}
