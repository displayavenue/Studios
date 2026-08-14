# Jyotish Kundali

Vedic kundali maker: enter birth details → pay → view chart + PDF → optional paid remedies add-on.

## Run locally

```bash
cd kundali-maker
npm install
npm run dev
```

Open the URL Vite prints (base path `/kundali-maker/`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run test:astrology` — smoke-test chart generation

## Pricing (MVP)

- Kundali PDF: ₹299 (mock pay)
- Remedies add-on: ₹199 (after kundali, optional)

## Stack

React + Vite + TypeScript, `astronomy-engine` (sidereal via Lahiri ayanamsa), jsPDF, localStorage orders.
