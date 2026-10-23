/**
 * Google ID token verification — SERVER-SIDE ONLY.
 *
 * **Contract:**
 * 1. Client obtains an ID token from Google (OAuth / One Tap) over HTTPS.
 * 2. Client sends `{ idToken }` to `POST /v1/auth/google` — never send raw user IDs.
 * 3. Backend verifies signature, `aud`, `iss`, and `exp` via `google-auth-library`.
 * 4. Backend upserts `User` + `UserIdentity` from verified `sub` and `email` claims.
 *
 * NEVER verify Google tokens in the browser or trust unverified payloads / client user IDs.
 */

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string | null;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
}

export interface GoogleIdTokenVerifier {
  /**
   * Verify a Google ID token and return the payload.
   * @throws on invalid signature, expiry, or audience mismatch.
   */
  verifyIdToken(idToken: string): Promise<GoogleTokenPayload>;
}

export class GoogleIdTokenVerificationError extends Error {
  readonly code = "INVALID_GOOGLE_TOKEN" as const;

  constructor(message: string, override readonly cause?: unknown) {
    super(message);
    this.name = "GoogleIdTokenVerificationError";
  }
}

export interface GoogleIdTokenVerifierOptions {
  /** Allowed OAuth client IDs (audience). Set via GOOGLE_CLIENT_ID env. */
  clientIds: readonly string[];
}

/**
 * Production verifier skeleton — dynamically loads `google-auth-library` when available.
 * Throws a clear configuration error when GOOGLE_CLIENT_ID is unset or the library is missing.
 */
export class GoogleIdTokenVerifierImpl implements GoogleIdTokenVerifier {
  constructor(private readonly options: GoogleIdTokenVerifierOptions) {
    if (!options.clientIds.length) {
      throw new GoogleIdTokenVerificationError(
        "GOOGLE_CLIENT_ID is not configured. Set at least one allowed audience.",
      );
    }
  }

  async verifyIdToken(idToken: string): Promise<GoogleTokenPayload> {
    if (!idToken?.trim()) {
      throw new GoogleIdTokenVerificationError("ID token is required");
    }

    type OAuth2ClientModule = {
      OAuth2Client: new () => {
        verifyIdToken(input: {
          idToken: string;
          audience: readonly string[];
        }): Promise<{ getPayload(): Record<string, unknown> | undefined }>;
      };
    };

    let OAuth2Client: OAuth2ClientModule["OAuth2Client"];
    try {
      // Optional dependency — installed in @homeopathypharma/api, not required in this package
      const mod = (await import(
        "google-auth-library" as string
      )) as OAuth2ClientModule;
      OAuth2Client = mod.OAuth2Client;
    } catch (cause) {
      throw new GoogleIdTokenVerificationError(
        "google-auth-library is not installed. Add it to @homeopathypharma/api dependencies.",
        cause,
      );
    }

    const client = new OAuth2Client();
    let ticket: { getPayload(): Record<string, unknown> | undefined };
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: this.options.clientIds,
      });
    } catch (cause) {
      throw new GoogleIdTokenVerificationError("Google ID token verification failed", cause);
    }

    const raw = ticket.getPayload();
    if (!raw?.sub || typeof raw.sub !== "string") {
      throw new GoogleIdTokenVerificationError("Token payload missing subject (sub)");
    }

    return mapGooglePayload(raw);
  }
}

function mapGooglePayload(raw: Record<string, unknown>): GoogleTokenPayload {
  const email = typeof raw.email === "string" ? raw.email : "";
  const emailVerified = raw.email_verified === true;
  const name = typeof raw.name === "string" ? raw.name : email;
  const picture = typeof raw.picture === "string" ? raw.picture : null;
  const aud = typeof raw.aud === "string" ? raw.aud : String(raw.aud ?? "");
  const iss = typeof raw.iss === "string" ? raw.iss : "";
  const exp = typeof raw.exp === "number" ? raw.exp : 0;
  const iat = typeof raw.iat === "number" ? raw.iat : 0;

  if (!email) {
    throw new GoogleIdTokenVerificationError("Token payload missing email");
  }

  return {
    sub: raw.sub as string,
    email,
    emailVerified,
    name,
    picture,
    aud,
    iss,
    exp,
    iat,
  };
}

/**
 * Stub verifier — throws until wired with GOOGLE_CLIENT_ID in the API service.
 * TODO: Replace with `new GoogleIdTokenVerifierImpl({ clientIds: [process.env.GOOGLE_CLIENT_ID] })`.
 */
export const stubGoogleIdTokenVerifier: GoogleIdTokenVerifier = {
  async verifyIdToken(_idToken: string): Promise<GoogleTokenPayload> {
    throw new GoogleIdTokenVerificationError(
      "Google ID token verification not configured. " +
        "Set GOOGLE_CLIENT_ID and use GoogleIdTokenVerifierImpl in @homeopathypharma/api.",
    );
  },
};
