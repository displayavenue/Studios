# Jyotish Kundali

Single-page Vedic kundali order site: **pay online (Razorpay)** or **ask on WhatsApp**.  
We prepare the kundali and send the PDF on WhatsApp.

**Live:** https://jyotishkundali.com/

## Run locally

```bash
cd kundali-maker
npm install
npm run dev
```

## Deploy

```bash
cd kundali-maker
SSH_PASS='…' npm run deploy:hostinger
```

Preserves Razorpay `api/config.php` keys and the `varnikya/` subdirectory when present.

## Flow

1. Visitor enters name, WhatsApp, birth details
2. **Pay** via Razorpay, or **Ask on WhatsApp**
3. You prepare the kundali and send the PDF on WhatsApp

## Stack

React + Vite + TypeScript, Razorpay PHP API, WhatsApp deep links.
