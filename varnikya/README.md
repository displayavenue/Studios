# Varnikya

Anti-tarnish jewellery e-commerce homepage.

**Live:** https://varnikya.jyotishkundali.com/  
(Subdomain of jyotishkundali.com — does **not** replace the kundali root site.)

## Local

```bash
cd varnikya
npm install
npm run dev
```

## Deploy

```bash
cd varnikya
SSH_PASS='…' npm run deploy:hostinger
```

Deploys to `domains/varnikya.jyotishkundali.com/public_html`.

**hPanel:** create subdomain `varnikya` for domain `jyotishkundali.com`, point to that folder, enable SSL.
