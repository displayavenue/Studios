# DisplayAvenue Agency (displayavenue.com)

Demo rebuild of the **DisplayAvenue** digital growth agency site — separate from DisplayAvenue Studios.

## Stack

- React 19 + TypeScript + Vite + React Router
- Design: Plus Jakarta Sans, navy / blue / white
- Static content in `src/data/` (CMS can be added later)

## Develop

```bash
cd agency
npm install
npm run dev
```

## Build

```bash
cd agency
npm run build
npm run preview
```

## Deploy to Hostinger (displayavenue.com)

Use a **separate** Hostinger website / FTP account from Studios (`displayavenuestudios.com`).

```bash
cd agency
export HOSTINGER_FTP_HOST=...
export HOSTINGER_FTP_USERNAME=...
export HOSTINGER_FTP_PASSWORD=...
# optional if not public_html:
# export HOSTINGER_FTP_REMOTE_PATH=public_html
bash scripts/deploy-hostinger.sh
```

`public/.htaccess` is included for React Router SPA fallbacks on Apache.

## Pages

Home, What We Do / Services, Industries, Solutions, AI Platform, Packages, Free Tools, Case Studies, Portfolio, Resources, Why DisplayAvenue, Contact (+ detail stubs).

Domain: [displayavenue.com](https://displayavenue.com)
