import { z } from "zod";
import { COUNTRY_CODES } from "./constants/countries.js";
import { CURRENCY_CODES } from "./constants/currencies.js";
import { LOCALE_CODES } from "./constants/locales.js";

const booleanFromEnv = z
  .enum(["true", "false", "1", "0"])
  .transform((v) => v === "true" || v === "1");

const optionalString = z.string().optional().default("");

const commaSeparatedList = z
  .string()
  .optional()
  .default("")
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

/** Zod schema mirroring `.env.example` — single source of truth for runtime config. */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "staging", "production"]).default("local"),

  WEB_URL: z.string().url(),
  DOCTOR_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
  API_URL: z.string().url(),
  API_PUBLIC_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),

  REDIS_URL: z.string().min(1),
  REDIS_PREFIX: z.string().min(1).default("hp:"),

  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().min(1).default("hp_session"),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(1_209_600),
  COOKIE_DOMAIN: z.string().min(1),
  COOKIE_SECURE: booleanFromEnv.default("false"),
  COOKIE_SAME_SITE: z.enum(["strict", "lax", "none"]).default("lax"),

  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
  GOOGLE_ALLOWED_AUDIENCES: commaSeparatedList,

  OTP_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
  EMAIL_FROM: z.string().min(1).default("HomeopathyPharma <noreply@homeopathypharma.com>"),

  SMS_PROVIDER: optionalString,
  SMS_API_KEY: optionalString,
  WHATSAPP_PROVIDER: optionalString,
  WHATSAPP_API_KEY: optionalString,

  RAZORPAY_KEY_ID: optionalString,
  RAZORPAY_KEY_SECRET: optionalString,
  RAZORPAY_WEBHOOK_SECRET: optionalString,

  SHIPROCKET_EMAIL: optionalString,
  SHIPROCKET_PASSWORD: optionalString,
  SHIPROCKET_BASE_URL: z.string().url().default("https://apiv2.shiprocket.in/v1"),
  SHIPROCKET_WEBHOOK_SECRET: optionalString,

  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1).default("us-east-1"),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_PUBLIC_BASE_URL: z.string().url(),
  S3_FORCE_PATH_STYLE: booleanFromEnv.default("true"),

  OPENSEARCH_NODE: z.string().url(),
  OPENSEARCH_USERNAME: optionalString,
  OPENSEARCH_PASSWORD: optionalString,
  OPENSEARCH_INDEX_PREFIX: z.string().min(1).default("hp"),

  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalString,
  SENTRY_DSN: optionalString,

  FEATURE_WHATSAPP: booleanFromEnv.default("false"),
  FEATURE_PET_CONSULTATIONS: booleanFromEnv.default("true"),
  FEATURE_MERCHANT_CENTER_EXPORT: booleanFromEnv.default("true"),

  ADMIN_ALLOWED_IPS: commaSeparatedList,
  ADMIN_REQUIRE_MFA: booleanFromEnv.default("true"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),

  DEFAULT_COUNTRY: z.enum(COUNTRY_CODES).default("IN"),
  DEFAULT_CURRENCY: z.enum(CURRENCY_CODES).default("INR"),
  DEFAULT_LOCALE: z.enum(LOCALE_CODES).default("en-IN"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables.
 * @param source Defaults to `process.env` — inject a custom object in tests.
 */
export function parseEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(source);
}

/** Safe parse returning a result object instead of throwing. */
export function safeParseEnv(source: NodeJS.ProcessEnv = process.env) {
  return envSchema.safeParse(source);
}
