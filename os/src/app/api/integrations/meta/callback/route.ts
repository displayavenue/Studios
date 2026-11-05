import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError } from "@/lib/api";
import { appBaseUrl } from "@/lib/org";
import { metaAdsAdapter, MetaNotConfiguredError } from "@/lib/platforms/metaAdapter";
import { encryptSecret, isEncryptionConfigured } from "@/lib/crypto/secrets";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    if (error) {
      return jsonError(errorDescription || error || "Meta OAuth error", 400);
    }
    if (!code || !state) {
      return jsonError("Missing code or state", 400);
    }

    let organizationId: string | null = null;
    try {
      const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8")) as {
        organizationId?: string;
      };
      organizationId = parsed.organizationId || null;
    } catch {
      return jsonError("Invalid OAuth state", 400);
    }
    if (!organizationId) return jsonError("organizationId missing from state", 400);

    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) return jsonError("Organization not found", 404);

    const redirectUri =
      process.env.META_OAUTH_REDIRECT_URI ||
      `${appBaseUrl()}/api/integrations/meta/callback`;

    let encryptedTokens = "encrypted:placeholder:meta_credentials_required";
    let status = "pending_credentials";
    let scopes: string[] = [];
    let exchangeError: string | null = null;

    try {
      if (!metaAdsAdapter.isConfigured()) {
        throw new MetaNotConfiguredError();
      }
      if (!isEncryptionConfigured()) {
        encryptedTokens = "encrypted:placeholder:pending_ENCRYPTION_KEY";
        status = "connected_unencrypted_blocked";
        exchangeError = "ENCRYPTION_KEY required to store Meta tokens";
      } else {
        const tokens = await metaAdsAdapter.exchangeCode({ code, redirectUri });
        scopes = tokens.scopes || [];
        encryptedTokens = encryptSecret(
          JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || null,
            expiresAt: tokens.expiresAt?.toISOString() || null,
          }),
        );
        status = "connected";
      }
    } catch (e) {
      exchangeError = e instanceof Error ? e.message : "Token exchange failed";
      if (e instanceof MetaNotConfiguredError) {
        encryptedTokens = "encrypted:placeholder:meta_credentials_required";
        status = "pending_credentials";
      } else {
        encryptedTokens = "encrypted:placeholder:exchange_failed";
        status = "error";
      }
    }

    const integration = await prisma.platformIntegration.upsert({
      where: {
        organizationId_platform: { organizationId, platform: "meta" },
      },
      create: {
        organizationId,
        platform: "meta",
        status,
        encryptedTokens,
        scopes,
        connectedAt: status === "connected" ? new Date() : null,
        meta: {
          state,
          exchangeError,
          updatedAt: new Date().toISOString(),
        },
      },
      update: {
        status,
        encryptedTokens,
        scopes,
        connectedAt: status === "connected" ? new Date() : null,
        meta: {
          state,
          exchangeError,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    await writeAudit({
      action: "meta.connect.callback",
      organizationId,
      entity: "platform_integration",
      entityId: integration.id,
      after: { status: integration.status },
    });

    const redirectTo = `${appBaseUrl()}/app/integrations/meta?org=${organizationId}&status=${encodeURIComponent(status)}`;
    return NextResponse.redirect(redirectTo);
  } catch (err) {
    if (err instanceof MetaNotConfiguredError) {
      return jsonError(err.message, err.status);
    }
    return handleApiError(err);
  }
}
