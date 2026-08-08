/**
 * Google ID token verification — SERVER-SIDE ONLY.
 *
 * The NestJS API must verify tokens using `google-auth-library`:
 *
 * ```ts
 * import { OAuth2Client } from "google-auth-library";
 * const client = new OAuth2Client(GOOGLE_CLIENT_ID);
 * const ticket = await client.verifyIdToken({ idToken, audience: allowedAudiences });
 * const payload = ticket.getPayload();
 * ```
 *
 * NEVER verify Google tokens in the browser or trust unverified payloads.
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

/**
 * Stub verifier — throws until wired with google-auth-library in the API service.
 * TODO: Replace with NestJS GoogleAuthService implementing GoogleIdTokenVerifier.
 */
export const stubGoogleIdTokenVerifier: GoogleIdTokenVerifier = {
  async verifyIdToken(_idToken: string): Promise<GoogleTokenPayload> {
    throw new GoogleIdTokenVerificationError(
      "Google ID token verification not configured. " +
        "Implement GoogleIdTokenVerifier in @homeopathypharma/api using google-auth-library.",
    );
  },
};
