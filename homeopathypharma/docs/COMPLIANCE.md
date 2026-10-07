# Compliance

Regulatory and policy framework for HomeopathyPharma.com. **This document is operational guidance, not legal advice.** Engage qualified local counsel before launch in each jurisdiction.

## Regulatory-sensitive areas (require local counsel)

| Area | India considerations | Action required |
|------|---------------------|-----------------|
| **Drug & cosmetics sales** | CDSCO/state licensing for pharmacy/e-commerce sale of drugs (including homeopathic medicines per applicable rules) | Confirm license scope, labeling, and interstate shipping rules |
| **Telemedicine** | National telemedicine guidelines, state medical council rules | Doctor verification SOP, prescription policy if applicable |
| **Data protection** | Digital Personal Data Protection Act (DPDPA) and rules | Privacy policy, consent, data principal rights |
| **Consumer protection** | Consumer Protection Act, e-commerce rules | Return/refund disclosures, grievance officer |
| **Advertising** | ASCI guidelines, drug advertising restrictions | No prohibited claims in marketing or SEO |
| **GST & invoicing** | GST registration, HSN codes, e-invoicing thresholds | Tax configuration in order snapshots |
| **Payment aggregation** | RBI PA guidelines (via Razorpay) | Use licensed payment provider only |

Mark each integration and feature flag with legal sign-off before production enablement.

## Policy placeholders

The following customer-facing policies must be drafted, reviewed by counsel, and published under `/legal/*` before public launch:

| Policy | Route placeholder | Status |
|--------|-------------------|--------|
| Terms of Service | `/legal/terms` | Draft in `apps/web/app/legal/terms` — **requires legal review** |
| Privacy Policy | `/legal/privacy` | Draft in `apps/web/app/legal/privacy` — **requires legal review** |
| Medical / product disclaimer | `/legal/disclaimer` | Draft in `apps/web/app/legal/disclaimer` — **requires legal review** |
| Return & refund policy | `/legal/returns` | **TODO — create page** |
| Shipping policy | `/legal/shipping` | **TODO — create page** |
| Cookie notice | footer banner | **TODO — implement consent UI** |

## Consent management

Track consent in `ConsentRecord` (see schema):

| ConsentType | When captured | Storage |
|-------------|---------------|---------|
| `TERMS` | Registration / first checkout | Timestamp + version hash |
| `PRIVACY` | Registration | Timestamp + version hash |
| `MARKETING` | Optional opt-in | Timestamp; withdrawable |
| `COOKIES` | Non-essential cookies | Banner + preference center |
| `TELEMEDICINE` | Before consultation booking | **Counsel to define copy** |

Do not pre-check marketing consent. Honor withdrawal within SLA defined by counsel.

## Disclaimers (product copy guidelines)

Content and product pages must include clear limitations:

- Homeopathic products are **not a substitute** for professional medical diagnosis or emergency care.
- Individual results vary; avoid guaranteed outcomes language.
- Consult a qualified practitioner before starting or stopping any treatment.
- Pet health content is informational — direct owners to a licensed veterinarian for diagnosis.

**Do not publish:**

- Claims to cure, prevent, or treat specific diseases unless permitted by applicable law and supported by approved evidence filed with counsel.
- Comparative superiority claims vs. allopathic medicine without substantiation.
- Testimonials presented as typical results.

## Medical content review

All `PageKind.CONTENT` health pages require `MedicalReviewStatus.APPROVED` before publish (see [WORKFLOWS.md](./WORKFLOWS.md)).

Reviewers must:

- Confirm alignment with approved medical editorial standards (counsel + medical advisor to define).
- Reject unsupported claims and outdated drug monographs.
- Record reviewer ID and date in publish history.

## Data retention & deletion

| Data class | Retention guidance |
|------------|-------------------|
| Orders & invoices | Statutory minimum (often 6–8 years for tax — **confirm with counsel**) |
| Medical / doctor verification docs | Retention schedule TBD with counsel; secure deletion after expiry |
| Marketing consents | Duration of relationship + limitation period |
| Audit logs | Security investigations — typically 1–2 years minimum |
| Soft-deleted users | Anonymize PII after cooling period while retaining order legal records |

Implement data export and erasure workflows per DPDPA — **legal review required** for exceptions (ongoing orders, litigation holds).

## Grievance & contact

Placeholder requirements (India e-commerce):

- Grievance officer name, email, phone — **to be appointed**.
- Response SLA — **counsel to define** (often 48 hours acknowledgment).

## Accessibility

Target WCAG 2.1 AA for public apps (`@homeopathypharma/ui` focus rings, skip links). Accessibility statements may be legally required in some markets.

## Related documents

- [SECURITY_THREAT_MODEL.md](./SECURITY_THREAT_MODEL.md)
- [SEO.md](./SEO.md)
- [DATA_MODEL.md](./DATA_MODEL.md)
