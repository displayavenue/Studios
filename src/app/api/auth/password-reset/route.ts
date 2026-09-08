import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { VerificationPurpose } from "@/generated/prisma/enums";
import { nanoid } from "nanoid";
import { sendEmail } from "@/providers/notifications";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return ok to avoid account enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = nanoid(32);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      email,
      token,
      code,
      purpose: VerificationPurpose.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.vercel.app";
  await sendEmail({
    to: email,
    subject: "Reset your JyotishKundali password",
    html: `<p>Use this link to reset your password (valid 1 hour):</p><p><a href="${site}/reset-password?token=${token}">Reset password</a></p><p>Or code: <strong>${code}</strong></p>`,
    text: `Reset: ${site}/reset-password?token=${token}`,
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const token = String(body.token || "");
  const password = String(body.password || "");
  if (!token || password.length < 8) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const row = await prisma.verificationToken.findFirst({
    where: {
      token,
      purpose: VerificationPurpose.PASSWORD_RESET,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
  if (!row?.userId) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });

  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: await hashPassword(password) },
  });
  await prisma.verificationToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
