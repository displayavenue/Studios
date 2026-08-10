export type PlatformConnectResult = {
  url: string;
  state: string;
};

export type PlatformCampaignStatus = "ACTIVE" | "PAUSED" | "ARCHIVED" | "UNKNOWN";

export type StoredCampaignMetric = {
  date: string;
  impressions?: number;
  clicks?: number;
  spendInr?: number;
  leads?: number;
  ctr?: number;
  cpc?: number;
  cpl?: number;
};

/**
 * Advertising platform adapter contract.
 * Implementations must never fabricate metrics when the platform is disconnected.
 */
export interface AdvertisingPlatformAdapter {
  platform: string;
  isConfigured(): boolean;
  getConnectUrl(params: {
    organizationId: string;
    redirectUri: string;
    state?: string;
  }): PlatformConnectResult;
  exchangeCode?(params: {
    code: string;
    redirectUri: string;
  }): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; scopes?: string[] }>;
  pauseCampaign?(externalId: string): Promise<void>;
  resumeCampaign?(externalId: string): Promise<void>;
  fetchMetrics?(externalId: string): Promise<StoredCampaignMetric[]>;
}

export class MetaNotConfiguredError extends Error {
  status = 503;
  constructor(
    message = "Meta approval / credentials required. Set META_APP_ID and META_APP_SECRET.",
  ) {
    super(message);
    this.name = "MetaNotConfiguredError";
  }
}

export class MetaAdsAdapter implements AdvertisingPlatformAdapter {
  platform = "meta";

  isConfigured(): boolean {
    return Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
  }

  getConnectUrl(params: {
    organizationId: string;
    redirectUri: string;
    state?: string;
  }): PlatformConnectResult {
    if (!process.env.META_APP_ID) {
      throw new MetaNotConfiguredError("Meta app credentials required");
    }
    const state =
      params.state ||
      Buffer.from(
        JSON.stringify({ organizationId: params.organizationId, nonce: Date.now() }),
      ).toString("base64url");
    const scopes = encodeURIComponent(
      process.env.META_OAUTH_SCOPES ||
        "ads_management,ads_read,business_management,pages_read_engagement",
    );
    const url =
      `https://www.facebook.com/v19.0/dialog/oauth` +
      `?client_id=${encodeURIComponent(process.env.META_APP_ID)}` +
      `&redirect_uri=${encodeURIComponent(params.redirectUri)}` +
      `&state=${encodeURIComponent(state)}` +
      `&scope=${scopes}` +
      `&response_type=code`;
    return { url, state };
  }

  async exchangeCode(params: { code: string; redirectUri: string }) {
    if (!this.isConfigured()) {
      throw new MetaNotConfiguredError();
    }
    const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", process.env.META_APP_ID!);
    tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET!);
    tokenUrl.searchParams.set("redirect_uri", params.redirectUri);
    tokenUrl.searchParams.set("code", params.code);

    const res = await fetch(tokenUrl.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new MetaNotConfiguredError(
        `Meta token exchange failed (${res.status}). Meta approval / credentials required. ${text.slice(0, 200)}`,
      );
    }
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!data.access_token) {
      throw new MetaNotConfiguredError("Meta token exchange returned no access_token");
    }
    return {
      accessToken: data.access_token,
      refreshToken: undefined as string | undefined,
      expiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000)
        : undefined,
      scopes: (process.env.META_OAUTH_SCOPES || "").split(",").filter(Boolean),
    };
  }

  async pauseCampaign(_externalId: string): Promise<void> {
    throw new MetaNotConfiguredError(
      "Meta API pause unavailable — Meta approval / credentials required",
    );
  }

  async resumeCampaign(_externalId: string): Promise<void> {
    throw new MetaNotConfiguredError(
      "Meta API resume unavailable — Meta approval / credentials required",
    );
  }

  async fetchMetrics(_externalId: string): Promise<StoredCampaignMetric[]> {
    // Never fabricate. Callers should return stored DB metrics instead.
    throw new MetaNotConfiguredError(
      "Meta metrics sync unavailable — Meta approval / credentials required. Use stored metrics only.",
    );
  }
}

export const metaAdsAdapter = new MetaAdsAdapter();
