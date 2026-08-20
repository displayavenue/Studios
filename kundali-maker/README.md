# Jyotish Kundali

Vedic kundali maker: enter birth details → pay → view chart + PDF → optional paid remedies add-on.

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

**First-time setup:** In Hostinger hPanel, connect `jyotishkundali.com` to this hosting account and enable SSL. Until then DNS may show a parked page.

The old mirror at `displayavenuestudios.com/kundali-maker/` was removed; that path 301-redirects to https://jyotishkundali.com/.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run test:astrology` — smoke-test chart generation
- `npm run deploy:hostinger` — build + SSH upload to Hostinger

## Pricing (MVP)

- Kundali PDF: ₹299
- Kundali Milan: ₹399
- Remedies add-on: ₹199 (after kundali, optional)
- Free SAMPLE PDF at `/sample`

## Stack

React + Vite + TypeScript, `astronomy-engine` (sidereal via Lahiri ayanamsa), jsPDF, localStorage orders.
