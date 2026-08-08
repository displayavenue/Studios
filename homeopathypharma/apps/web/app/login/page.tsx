import type { Metadata } from "next";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Sign in", "/login", "Secure sign-in backed by the HomeopathyPharma API."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Sign in" description="Secure sign-in backed by the HomeopathyPharma API." path="/login">
      <p className="product-placeholder">
        Sign-in UI posts credentials or OAuth tokens to <code>POST /v1/auth/login</code>. For Google sign-in, the
        browser receives an ID token from Google; that token is sent to the backend for verification — client-side
        tokens are never trusted for identity on their own.
      </p>
      <p style={{ fontSize: "var(--hp-text-sm)", marginTop: "var(--hp-space-4)" }}>
        Google OAuth callback is handled API-side at <code>/v1/auth/google/callback</code>.
      </p>
    </ContentPage>
  );
}
