# Workflows

End-to-end flows for HomeopathyPharma.com. All paths assume **server-side enforcement** in `services/api` unless noted.

## 1. Google / OTP authentication

```mermaid
sequenceDiagram
  participant C as Client
  participant API as API /v1/auth
  participant G as Google
  participant R as Redis
  participant DB as PostgreSQL

  alt Google sign-in
    C->>G: OAuth / One Tap (client SDK)
    G-->>C: ID token
    C->>API: POST /auth/google { idToken }
    API->>G: verifyIdToken (google-auth-library)
    Note over API: Validate aud, iss, exp, email_verified
    API->>DB: upsert User + Identity
    API->>R: create session
    API-->>C: Set-Cookie session + user profile
  else Email/phone OTP
    C->>API: POST /auth/otp/request { channel, address }
    API->>API: rate limit + generate OTP
    API-->>C: 202 (no OTP in response)
    C->>API: POST /auth/otp/verify { address, code }
    API->>DB: upsert User + Identity
    API->>R: create session
    API-->>C: Set-Cookie session
  end
```

**Key controls:**

- Google ID tokens verified **only on backend** (`packages/auth/src/google/verify-id-token.ts`).
- OTP attempts capped (`OTP_MAX_ATTEMPTS`); OTP TTL (`OTP_TTL_SECONDS`).
- Session cookie: `HttpOnly`, `Secure` in production, `SameSite=Lax`.
- Account status checked (`ACTIVE` vs `SUSPENDED`/`LOCKED`).

## 2. Doctor verification

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> SUBMITTED: doctor submits credentials
  SUBMITTED --> IN_REVIEW: admin queue
  IN_REVIEW --> NEEDS_MORE_INFO: request documents
  NEEDS_MORE_INFO --> SUBMITTED: doctor re-submits
  IN_REVIEW --> APPROVED: verifier approves
  IN_REVIEW --> REJECTED: verifier rejects
  APPROVED --> SUSPENDED: compliance action
  REJECTED --> [*]
  SUSPENDED --> APPROVED: reinstatement
```

**Steps:**

1. Doctor registers (Google/OTP) → `DoctorProfile` in `DRAFT`.
2. Uploads registration certificate, government ID → **private S3** prefix; presigned URLs expire quickly.
3. Submits application → `SUBMITTED`; notifications to admin queue.
4. Admin reviewer validates documents (manual + checklist); may set `NEEDS_MORE_INFO`.
5. On `APPROVED`: public profile fields published; doctor portal unlocked; optional OpenSearch index update.
6. `REJECTED` / `SUSPENDED`: public profile hidden; existing appointments handled per policy.

**Anti-fake-doctor controls:** document MIME + size validation, malware scan hook, duplicate registration number check, manual approval required, audit log on every status change.

## 3. Product publish

```mermaid
flowchart LR
  A[Admin creates DRAFT] --> B[Catalog review]
  B --> C{Approved?}
  C -->|yes| D[PUBLISHED]
  C -->|no| E[REJECTED / DRAFT]
  D --> F[search-index job]
  D --> G[sitemap segment job]
  D --> H[Merchant feed job]
```

**Steps:**

1. Admin creates product + variants in `DRAFT`.
2. Pricing, tax class, images uploaded via presigned S3 URLs.
3. Inventory batches recorded (`RECEIPT` movement).
4. Reviewer approves → `PublishStatus.PUBLISHED`.
5. Worker enqueues: OpenSearch index, sitemap chunk update, optional Google Merchant feed row.

Unpublish sets `UNPUBLISHED` / soft-delete; index and sitemap entries removed asynchronously.

## 4. Checkout + Razorpay verify + webhook

```mermaid
sequenceDiagram
  participant C as Client
  participant API as API
  participant RZ as Razorpay
  participant W as Worker
  participant DB as PostgreSQL

  C->>API: POST /checkout (Idempotency-Key)
  API->>DB: reserve inventory + CheckoutSession
  API->>RZ: create order
  API-->>C: razorpay_order_id + amount

  C->>RZ: customer pays (checkout UI)
  C->>API: POST /payments/verify { orderId, paymentId, signature }
  API->>API: HMAC verify (key_secret)
  API->>DB: Order + snapshots + CAPTURED payment
  API->>W: enqueue orders + inventory commit

  RZ->>API: POST /webhooks/razorpay (signed)
  API->>API: verify X-Razorpay-Signature
  API->>API: idempotent handler
  API->>DB: reconcile if verify missed
```

**Key controls:**

- Checkout idempotent via `Idempotency-Key`.
- Amount/currency must match server `CheckoutSession` — reject client tampering.
- Payment signature verified with `RAZORPAY_KEY_SECRET` before marking paid.
- Webhook verified with `RAZORPAY_WEBHOOK_SECRET`; duplicate events ignored via idempotency store.
- Inventory reservation released on payment failure/timeout.

## 5. Shiprocket shipment state machine

```mermaid
stateDiagram-v2
  [*] --> PENDING
  PENDING --> READY_TO_SHIP: order packed
  READY_TO_SHIP --> PICKUP_SCHEDULED: AWB created
  PICKUP_SCHEDULED --> PICKED_UP: courier pickup
  PICKED_UP --> IN_TRANSIT
  IN_TRANSIT --> OUT_FOR_DELIVERY
  OUT_FOR_DELIVERY --> DELIVERED
  IN_TRANSIT --> NDR: delivery failed
  NDR --> OUT_FOR_DELIVERY: reattempt
  IN_TRANSIT --> RTO: return to origin
  RTO --> RETURNED
  PENDING --> CANCELLED: cancelled pre-pickup
```

**Steps:**

1. Paid order → admin/system creates Shiprocket shipment via API integration.
2. AWB and label stored; `Shipment` row created.
3. Shiprocket webhooks (`POST /webhooks/shiprocket`) update status — **signature verified** with `SHIPROCKET_WEBHOOK_SECRET`.
4. Invalid transitions rejected (`packages/integrations` state machine).
5. `DELIVERED` triggers referral accrual eligibility timer and review invitation.

## 6. Consultation booking

```mermaid
sequenceDiagram
  participant P as Patient
  participant API as API
  participant RZ as Razorpay
  participant D as Doctor

  P->>API: GET /consultations/availability
  P->>API: POST /appointments (slot + service)
  API->>API: lock slot (optimistic / row lock)
  alt paid consultation
    API->>RZ: payment order
    P->>API: POST /payments/verify
    API->>DB: CONFIRMED
  else free intake
    API->>DB: CONFIRMED
  end
  API->>D: notification
  API->>P: confirmation + calendar ICS
```

**Controls:** slot double-booking prevented by transactional slot lock; cancellation policy enforced server-side; no-show transitions via scheduled worker job.

## 7. Referral commission ledger

```mermaid
flowchart TD
  A[Referrer shares code] --> B[Referee checkout applies code]
  B --> C[Order paid + delivered]
  C --> D[Eligibility window passes]
  D --> E[Worker: ACCRUAL ledger entry]
  E --> F{Return/refund?}
  F -->|yes| G[REVERSAL entry]
  F -->|no| H[Payout request]
  H --> I[PAYOUT entry + transfer]
```

**Rules:**

- Accrual only after delivery + cooling period (configurable).
- Returns trigger `REVERSAL` — never delete accrual rows.
- Self-referral and circular referral patterns blocked.
- Coupon stacking rules enforced at checkout.

## 8. Review moderation

1. Customer submits review linked to `orderLineSnapshotId`.
2. API validates verified purchase + delivery status.
3. Review created with `ReviewModerationStatus.PENDING`.
4. Moderator approves/rejects/flags in admin.
5. Only `APPROVED` reviews appear on PDP; aggregate rating recalculated.

Automated profanity/spam filters may flag; human approval required for disputed cases.

## 9. Content medical review

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> PENDING: author submits
  PENDING --> IN_REVIEW: medical reviewer assigned
  IN_REVIEW --> APPROVED: clinically acceptable
  IN_REVIEW --> REJECTED
  IN_REVIEW --> NEEDS_UPDATE
  NEEDS_UPDATE --> PENDING: author revises
  APPROVED --> PUBLISHED: publish action
```

**Rules:**

- `MedicalReviewStatus.APPROVED` required before public `CONTENT` pages go live.
- Reviewer credentials tracked; separation of duties (author ≠ approver).
- Published content changes create new `ContentPublishHistory` row — prior version retained.
- No unsupported disease-treatment claims; see [COMPLIANCE.md](./COMPLIANCE.md).

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DATA_MODEL.md](./DATA_MODEL.md)
- [SECURITY_THREAT_MODEL.md](./SECURITY_THREAT_MODEL.md)
