import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, type SessionUser } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";
import { sendSmsOtp } from "@/providers/notifications/sms";
import { useMockProviders } from "@/config/site";

const OTP_TTL_MS = 10 * 60 * 1000;

export function normalizeIndianPhone(raw: string) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(phone10: string) {
  return /^[6-9]\d{9}$/.test(phone10);
}

function phoneEmail(phone10: string) {
  return `phone.${phone10}@phone.jyotishkundali.com`;
}

export async function sendLoginOtp(input: { phone: string; countryCode?: string }) {
  const phone10 = normalizeIndianPhone(input.phone);
  if (!isValidIndianMobile(phone10)) {
    throw new Error("INVALID_PHONE");
  }

  const code = useMockProviders() ? "123456" : String(randomInt(100000, 999999));
  const token = `otp_${phone10}_${Date.now()}`;

  await prisma.verificationToken.create({
    data: {
      phone: phone10,
      token,
      code,
      purpose: "LOGIN_OTP",
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const sms = await sendSmsOtp({
    to: `+91${phone10}`,
    message: `Your JyotishKundali OTP is ${code}. Valid for 10 minutes.`,
  });

  return {
    ok: true,
    phone: phone10,
    expiresInSec: OTP_TTL_MS / 1000,
    mock: sms.mock,
    /** Only returned when mock providers are forced — never on live SMS */
    debugCode: useMockProviders() ? code : undefined,
  };
}

export async function verifyLoginOtp(input: { phone: string; code: string }) {
  const phone10 = normalizeIndianPhone(input.phone);
  const code = String(input.code || "").trim();
  if (!isValidIndianMobile(phone10) || !/^\d{4,8}$/.test(code)) {
    throw new Error("INVALID_OTP");
  }

  const row = await prisma.verificationToken.findFirst({
    where: {
      phone: phone10,
      purpose: "LOGIN_OTP",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!row || row.code !== code) {
    throw new Error("INVALID_OTP");
  }

  await prisma.verificationToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });

  let user = await prisma.user.findFirst({ where: { phone: phone10 } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: phoneEmail(phone10),
        phone: phone10,
        role: Role.CUSTOMER,
        emailVerified: false,
        firstName: "Guest",
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return sessionUser;
}

/** Mock Google OAuth for demo when real Google keys are absent. */
export async function mockGoogleLogin() {
  const email = "google.demo@jyotishkundali.com";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        googleId: `mock_google_${Date.now()}`,
        role: Role.CUSTOMER,
        emailVerified: true,
        firstName: "Google",
        lastName: "Demo",
      },
    });
  }
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return sessionUser;
}
