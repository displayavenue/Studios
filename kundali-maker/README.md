# Jyotish Kundali

Vedic kundali maker: enter birth details → pay → view chart + PDF → optional paid remedies add-on.

## Run locally

```bash
cd kundali-maker
npm install
npm run dev
```

Open the URL Vite prints (base path `/kundali-maker/`).

## Hostinger deploy

**Interim (live now on existing hosting):**

```bash
cd kundali-maker
SSH_PASS='…' npm run deploy:hostinger
```

Opens at: `https://displayavenuestudios.com/kundali-maker/`

**When you have a dedicated domain** (add domain in Hostinger hPanel first):

```bash
cd kundali-maker
VITE_BASE=/ SSH_DOC=domains/YOURDOMAIN.com/public_html SSH_PASS='…' npm run deploy:hostinger
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run test:astrology` — smoke-test chart generation
- `npm run deploy:hostinger` — build + SSH upload to Hostinger

## Pricing (MVP)

- Kundali PDF: ₹299 (mock pay)
- Remedies add-on: ₹199 (after kundali, optional)

## Stack

React + Vite + TypeScript, `astronomy-engine` (sidereal via Lahiri ayanamsa), jsPDF, localStorage orders.
