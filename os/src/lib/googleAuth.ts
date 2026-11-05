import { createHash, randomBytes } from "crypto";

const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

export function googleOAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getGoogleClientId() {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
}

export function getAppUrl() {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function googleCallbackUrl() {
  return `${getAppUrl()}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID not configured");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    include_granted_scopes: "true",
    prompt: "select_account",
    state,
  });
  return `${GOOGLE_AUTH}?${params.toString()}`;
}

export function createOAuthState(returnTo: string) {
  const nonce = randomBytes(16).toString("hex");
  const payload = Buffer.from(JSON.stringify({ returnTo, nonce }), "utf8").toString("base64url");
  const sig = createHash("sha256")
    .update(`${payload}.${process.env.JWT_SECRET || "dev"}`)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function parseOAuthState(state: string): { returnTo: string } | null {
  const [payload, sig] = state.split(".");
  if (!payload || !sig) return null;
  const expected = createHash("sha256")
    .update(`${payload}.${process.env.JWT_SECRET || "dev"}`)
    .digest("base64url");
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      returnTo?: string;
    };
    const returnTo = data.returnTo || "/growth360";
    if (!returnTo.startsWith("/") || returnTo.startsWith("//")) return { returnTo: "/growth360" };
    return { returnTo };
  } catch {
    return null;
  }
}

export type GoogleProfile = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
};

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google OAuth not configured");

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: googleCallbackUrl(),
    grant_type: "authorization_code",
  });

  const tokenRes = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!tokenRes.ok || !tokenJson.access_token) {
    throw new Error(tokenJson.error_description || tokenJson.error || "Google token exchange failed");
  }

  const userRes = await fetch(GOOGLE_USERINFO, {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  const profile = (await userRes.json()) as Partial<GoogleProfile> & { error?: string };
  if (!userRes.ok || !profile.email || !profile.sub) {
    throw new Error(profile.error || "Failed to load Google profile");
  }

  return {
    sub: profile.sub,
    email: profile.email.toLowerCase(),
    email_verified: profile.email_verified,
    name: profile.name || profile.email.split("@")[0],
    picture: profile.picture,
  };
}
