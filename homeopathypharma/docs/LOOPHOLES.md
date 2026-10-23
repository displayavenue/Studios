# Security loophole checklist

Tracking known gaps between design intent and implementation. Status values:

- **Closed-in-design** — Control documented and enforced in code/schema; verified in tests or review.
- **Stub** — Interface, guard, or route exists; production wiring pending.
- **Needs credentials** — Blocked on external service keys (Google, Razorpay, Shiprocket, etc.).

| # | Loophole | Status | Mitigation |
|---|----------|--------|------------|
| 1 | Client-supplied user ID trusted for auth | **Closed-in-design** | Google ID token verified server-side; `sub` from verified payload only (`GoogleIdTokenVerifierImpl`) |
| 2 | Google token verified in browser | **Closed-in-design** | `POST /v1/auth/google` contract; backend-only verification |
| 3 | Fake doctor signup without manual review | **Closed-in-design** | `DoctorVerificationStatus` workflow; unverified doctors blocked from public listing |
| 4 | Fake / spam reviews | **Stub** | Verified-purchase gate + `ReviewModerationQueue`; moderation API stub |
| 5 | Coupon / referral self-abuse | **Stub** | `CustomerCoupon`, ledger reversals; checkout rules not wired |
| 6 | Refund fraud / double refund | **Stub** | Idempotency + Finance approval queue; Razorpay refund stub |
| 7 | Overselling (race at checkout) | **Closed-in-design** | `StockReservation` + inventory movements in schema; reservation-before-payment documented |
| 8 | Payment webhook spoofing | **Stub** | `assertWebhookSignatureOrThrow` in `@homeopathypharma/integrations`; webhook routes `@Public` skip CSRF |
| 9 | Frontend price tampering | **Closed-in-design** | Server-computed checkout totals; immutable order snapshots; Razorpay amount from server |
| 10 | CSRF on cookie-auth mutations | **Closed-in-design** | `createCsrfToken` / `verifyCsrfToken` + `CsrfGuard` on API |
| 11 | Admin/doctor access without MFA | **Closed-in-design** | `requiresMfa()` policy for SUPER_ADMIN, ADMIN, DOCTOR, FINANCE, SUPPORT, CONTENT_EDITOR, MEDICAL_REVIEWER |
| 12 | MFA enrollment not enforced at login | **Stub** | Policy defined; TOTP/WebAuthn enrollment flow not implemented |
| 13 | Shiprocket webhook spoofing | **Stub** | Signature check hook in webhooks controller; needs credentials |
| 14 | Session fixation / hijacking | **Stub** | Session rotation on login designed; Redis session store in progress |
| 15 | IDOR on orders / documents | **Stub** | Ownership-scoped queries documented; integration tests planned |
| 16 | Private pages indexed | **Closed-in-design** | `robots.txt`, `noindex` on account/checkout; segmented sitemaps exclude private routes |
| 17 | Medical document public exposure | **Closed-in-design** | Private S3 prefix; presigned URLs; `DocumentAccessLog` |
| 18 | Thin AI-generated SEO pages | **Closed-in-design** | Publish + medical review workflow; SEO policy prohibits thin pages |
| 19 | SUPER_ADMIN role missing from seed | **Closed-in-design** | `SUPER_ADMIN` in seed.ts with full permission grants |
| 20 | Payment state skipped (CREATED→CAPTURED jump) | **Closed-in-design** | State machine documents CREATED→PENDING→AUTHORIZED→CAPTURED/FAILED/REFUNDED |
| 21 | Inventory not reserved before payment | **Closed-in-design** | Reservation documented in threat model; schema supports `StockReservation` |
| 22 | Razorpay payment signature bypass | **Needs credentials** | `verifyPaymentSignature` stub until `RAZORPAY_KEY_SECRET` configured |
| 23 | Google OAuth not live | **Needs credentials** | `GoogleIdTokenVerifierImpl` throws until `GOOGLE_CLIENT_ID` + library installed in API |
| 24 | OTP brute force | **Stub** | Rate limit middleware exists; OTP store not wired |
| 25 | ReferralRule vs DoctorReferralRule confusion | **Closed-in-design** | `DoctorReferralRule` added (`doctor_referral_rules`); legacy `ReferralRule` documented |

## Review cadence

- Update this checklist when closing a stub or obtaining credentials.
- Cross-reference [SECURITY_THREAT_MODEL.md](./SECURITY_THREAT_MODEL.md) for threat → control mapping.
- Penetration test findings should add rows here with remediation status.

## Related documents

- [SECURITY_THREAT_MODEL.md](./SECURITY_THREAT_MODEL.md)
- [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)
- [ROADMAP.md](./ROADMAP.md)
