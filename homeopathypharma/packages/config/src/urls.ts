import type { Env } from "./env.js";

export interface AppUrls {
  web: string;
  doctor: string;
  admin: string;
  api: string;
  apiPublic: string;
  s3Public: string;
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** Normalized application URLs derived from validated env. */
export function appUrls(env: Pick<Env, "WEB_URL" | "DOCTOR_URL" | "ADMIN_URL" | "API_URL" | "API_PUBLIC_URL" | "S3_PUBLIC_BASE_URL">): AppUrls {
  return {
    web: stripTrailingSlash(env.WEB_URL),
    doctor: stripTrailingSlash(env.DOCTOR_URL),
    admin: stripTrailingSlash(env.ADMIN_URL),
    api: stripTrailingSlash(env.API_URL),
    apiPublic: stripTrailingSlash(env.API_PUBLIC_URL),
    s3Public: stripTrailingSlash(env.S3_PUBLIC_BASE_URL),
  };
}

export type AppSurface = keyof AppUrls;

/** Build an absolute URL on a given app surface. */
export function buildAppUrl(
  urls: AppUrls,
  surface: AppSurface,
  path: string,
): string {
  const base = urls[surface];
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
