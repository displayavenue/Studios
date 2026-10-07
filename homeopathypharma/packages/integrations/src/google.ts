/**
 * Google integrations — SERVER-SIDE ONLY.
 * TODO: verifyIdToken via google-auth-library; Merchant Center feed via scheduled worker.
 */

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string | null;
  aud: string;
}

export interface GoogleClient {
  verifyIdToken(idToken: string, allowedAudiences: string[]): Promise<GoogleTokenPayload>;
}

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super("Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_ALLOWED_AUDIENCES.");
    this.name = "GoogleNotConfiguredError";
  }
}

export const stubGoogleClient: GoogleClient = {
  async verifyIdToken() {
    throw new GoogleNotConfiguredError();
  },
};

/** Google Merchant Center product feed row — align with Content API spec. */
export interface MerchantCenterFeedRow {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  availability: "in_stock" | "out_of_stock" | "preorder";
  price: string;
  brand: string;
  gtin?: string;
  mpn?: string;
  condition: "new";
  googleProductCategory?: string;
  customLabel0?: string;
  shipping?: string;
}

export function merchantCenterFeedRowToTsv(row: MerchantCenterFeedRow, headers: (keyof MerchantCenterFeedRow)[]): string {
  return headers.map((h) => String(row[h] ?? "")).join("\t");
}

export const MERCHANT_CENTER_FEED_HEADERS: (keyof MerchantCenterFeedRow)[] = [
  "id",
  "title",
  "description",
  "link",
  "imageLink",
  "availability",
  "price",
  "brand",
  "gtin",
  "mpn",
  "condition",
  "googleProductCategory",
];
