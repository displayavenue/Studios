# @homeopathypharma/doctor

Doctor portal for HomeopathyPharma — Next.js 15 App Router on port **3001**.

## Development

```bash
pnpm install
pnpm dev:doctor
```

API stubs in `lib/api.ts` target `API_URL/v1/doctor/*`. Authentication and role checks are enforced server-side by the API.

## Features (shell)

- Login
- Dashboard: schedule, upcoming consults, verification status
- Patients, consultations, availability, referrals, earnings, reviews
- Document upload for verification

## Design

Clinical workspace framing with `@homeopathypharma/ui` `DoctorShell`, Fraunces + Source Serif 4 typography, WCAG focus patterns.
