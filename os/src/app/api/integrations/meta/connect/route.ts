import { z } from "zod";
import { requireOrgAccess } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { appBaseUrl } from "@/lib/org";
import { metaAdsAdapter, MetaNotConfiguredError } from "@/lib/platforms/metaAdapter";

const schema = z.object({
  organizationId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await requireOrgAccess(body.organizationId, "integration:meta", req);

    if (!process.env.META_APP_ID) {
      return jsonError("Meta app credentials required", 503);
    }

    const redirectUri =
      process.env.META_OAUTH_REDIRECT_URI ||
      `${appBaseUrl()}/api/integrations/meta/callback`;

    const { url, state } = metaAdsAdapter.getConnectUrl({
      organizationId: body.organizationId,
      redirectUri,
    });

    return jsonOk({ url, state, redirectUri });
  } catch (err) {
    if (err instanceof MetaNotConfiguredError) {
      return jsonError(err.message, err.status);
    }
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const organizationId = url.searchParams.get("organizationId");
    if (!organizationId) return jsonError("organizationId required", 400);
    await requireOrgAccess(organizationId, "integration:meta", req);

    if (!process.env.META_APP_ID) {
      return jsonError("Meta app credentials required", 503);
    }

    const redirectUri =
      process.env.META_OAUTH_REDIRECT_URI ||
      `${appBaseUrl()}/api/integrations/meta/callback`;
    const result = metaAdsAdapter.getConnectUrl({ organizationId, redirectUri });
    return jsonOk(result);
  } catch (err) {
    if (err instanceof MetaNotConfiguredError) {
      return jsonError(err.message, err.status);
    }
    return handleApiError(err);
  }
}
