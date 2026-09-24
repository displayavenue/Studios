export { ROLES, ROLE_PERMISSION_DEFAULTS } from "./rbac/roles.js";
export type { Role } from "./rbac/roles.js";

export {
  PERMISSION_CATALOG,
  PERMISSION_DESCRIPTIONS,
  ALL_PERMISSIONS,
} from "./rbac/permissions.js";
export type { Permission } from "./rbac/permissions.js";

export {
  AuthorizationError,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requireRole,
  requirePermission,
  createAuthContext,
} from "./rbac/helpers.js";
export type { AuthorizationContext } from "./rbac/helpers.js";

export type {
  SessionUser,
  SessionData,
  AuthenticatedRequest,
  SessionStatus,
  SessionLookupResult,
  GuestSession,
} from "./types/session.js";

export {
  stubGoogleIdTokenVerifier,
  GoogleIdTokenVerificationError,
  GoogleIdTokenVerifierImpl,
} from "./google/verify-id-token.js";
export type {
  GoogleTokenPayload,
  GoogleIdTokenVerifier,
  GoogleIdTokenVerifierOptions,
} from "./google/verify-id-token.js";

export { requiresMfa } from "./policies/mfa.js";

export {
  createCsrfToken,
  verifyCsrfToken,
} from "./csrf/tokens.js";
export type {
  CsrfTokenPayload,
  CreateCsrfTokenOptions,
  VerifyCsrfTokenOptions,
} from "./csrf/tokens.js";
