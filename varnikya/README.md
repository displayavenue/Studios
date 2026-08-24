# Varnikya

Anti-tarnish jewellery e-commerce homepage.

**Live:** https://jyotishkundali.com/varnikya/  

Served as a path on jyotishkundali.com — does **not** replace the kundali root site.

## Local

```bash
cd varnikya
npm install
npm run dev
```

Dev uses Vite base `/varnikya/` (open http://localhost:5173/varnikya/).

## Deploy

```bash
cd varnikya
SSH_PASS='…' npm run deploy:hostinger
```

Deploys only to `domains/jyotishkundali.com/public_html/varnikya` (subdirectory).
