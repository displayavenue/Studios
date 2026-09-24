import { z } from "zod";

export const googleIdTokenLoginSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
  /** Optional referral or campaign attribution — validated server-side. */
  referralCode: z.string().trim().max(64).optional(),
});

export type GoogleIdTokenLoginInput = z.infer<typeof googleIdTokenLoginSchema>;

export const otpRequestSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, "Phone must be E.164 format"),
  channel: z.enum(["sms", "whatsapp"]).default("sms"),
  /** ISO 3166-1 alpha-2 — used for locale-aware OTP templates. */
  countryCode: z.string().length(2).toUpperCase().optional(),
});

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, "Phone must be E.164 format"),
  otp: z.string().trim().regex(/^\d{4,8}$/, "OTP must be 4–8 digits"),
  /** Server-issued challenge id from OTP request response. */
  challengeId: z.string().uuid(),
});

export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

export const authRefreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type AuthRefreshInput = z.infer<typeof authRefreshSchema>;

export const logoutSchema = z.object({
  everywhere: z.boolean().default(false),
});

export type LogoutInput = z.infer<typeof logoutSchema>;
