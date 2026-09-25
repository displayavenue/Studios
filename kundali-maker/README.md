# Jyotish Kundali

Vedic kundali maker: enter birth details → generate chart → download full ~20 page PDF.

**Current mode:** free generation preview (Razorpay paused). Payment will be added after generation is verified.

## Run locally

```bash
cd kundali-maker
npm install
npm run dev
```

## Hostinger deploy (production)

Domain: **https://jyotishkundali.com/**

```bash
cd kundali-maker
SSH_PASS='…' npm run deploy:hostinger
```

Deploys to `domains/jyotishkundali.com/public_html` with `base=/`.
Preserves `varnikya/` subdirectory and existing Razorpay `api/config.php` keys when env secrets are unset.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run test:astrology` — smoke-test chart generation
- `npm run test:pdf` — build sample complete PDF + page count check
- `npm run deploy:hostinger` — build + SSH upload to Hostinger

## Flow (preview)

1. Landing → Generate
2. Enter birth details → confirm
3. Chart unlocks instantly (no payment)
4. Download complete ~20 page PDF

## Stack

React + Vite + TypeScript, `astronomy-engine` (sidereal via Lahiri ayanamsa), jsPDF, localStorage orders.
