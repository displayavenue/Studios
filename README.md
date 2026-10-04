# DisplayAvenue Real Estate
Website for **DisplayAvenue Real Estate** — buy, sell, rent, commercial and redevelopment across **Dahisar, Mira Road & Bhayandar**.

## Stack

- React 19 + TypeScript + Vite + React Router
- Content JSON under `/public/content` (optional CMS overrides)
- Hostinger PHP inquiry endpoint + SPA `.htaccess`
- Design: Fraunces + Outfit, forest ink / brass

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Hostinger)

This site is deployed on **Hostinger**, not Vercel.

```bash
# Apex domain (after domain is attached in hPanel)
SSH_PASS='…' ./scripts/deploy-ssh.sh

# Interim live path on displayavenue.com
SSH_PASS='…' SSH_DOC='domains/displayavenue.com/public_html/realestate' VITE_BASE='/realestate/' ./scripts/deploy-ssh.sh
```

Default remote path: `domains/displayavenuerealestate.com/public_html`

## Pages

Home, Buy, Rent, Commercial, Property detail, Sell / valuation, Redevelopment, Localities, About, Blog, FAQs, Contact, Privacy, Terms.

Company: [displayavenuerealestate.com](https://displayavenuerealestate.com) · Mira Road East
