import { describe, expect, it } from "vitest";
import { createCsrfToken, verifyCsrfToken } from "./tokens.js";

const SECRET = "test-csrf-secret-at-least-32-chars-long";

describe("CSRF token helpers", () => {
  it("creates a token that verifies with matching session", () => {
    const { token } = createCsrfToken({
      secret: SECRET,
      sessionId: "sess-123",
      ttlSeconds: 300,
    });

    expect(verifyCsrfToken(token, { secret: SECRET, sessionId: "sess-123" })).toBe(true);
  });

  it("rejects token when sessionId does not match", () => {
    const { token } = createCsrfToken({ secret: SECRET, sessionId: "sess-a" });
    expect(verifyCsrfToken(token, { secret: SECRET, sessionId: "sess-b" })).toBe(false);
  });

  it("rejects token signed with a different secret", () => {
    const { token } = createCsrfToken({ secret: SECRET });
    expect(verifyCsrfToken(token, { secret: "other-secret-that-is-long-enough-12345" })).toBe(
      false,
    );
  });

  it("rejects expired tokens", () => {
    const { token } = createCsrfToken({ secret: SECRET, ttlSeconds: 60 });
    expect(
      verifyCsrfToken(token, {
        secret: SECRET,
        nowSeconds: Math.floor(Date.now() / 1000) + 120,
      }),
    ).toBe(false);
  });

  it("rejects missing or malformed tokens", () => {
    expect(verifyCsrfToken(undefined, { secret: SECRET })).toBe(false);
    expect(verifyCsrfToken("not-a-valid-token", { secret: SECRET })).toBe(false);
  });

  it("requires a secret to create tokens", () => {
    expect(() => createCsrfToken({ secret: "" })).toThrow("CSRF secret is required");
  });
});
