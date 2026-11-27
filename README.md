# DisplayAvenue Studios

Premium website for **DisplayAvenue Studios** — India's Premium Visual Production Studio.

## Stack

- React 19 + TypeScript + Vite + React Router
- Hostinger PHP CMS at `/admin` (edits JSON in `/content`)
- Design system: Cormorant Garamond + Poppins, black / gold / white

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

## CMS (edit the live site)

1. Deploy the build to Hostinger `public_html`
2. Open `https://displayavenuestudios.com/admin/`
3. Login — default password in `admin/config.php`: `DisplayAdmin@2026` (**change it**)
4. Edit company info, services, packages, portfolio, blogs, FAQs, team, etc.
5. Click **Save changes** — refresh the website to see updates

Ensure the `content/` folder is writable (chmod 755/775).

## Pages

Home, About, Services (+ detail), Packages, Pricing, Portfolio (+ detail), Industries, Locations (+ detail), Blog, FAQs, Book Now, Contact.

Company: [displayavenuestudios.com](https://displayavenuestudios.com) · Mumbai · Pan India

## SEO build (prerendering)

`npm run build:seo` = `vite build` + `scripts/prerender.mjs`. The prerender step opens every
URL in `sitemap.xml` in headless Chrome/Edge (set `CHROME_PATH` if it isn't found) and writes
full HTML to `dist/index.html` and `dist/_pre/<route>.html`. `.htaccess` serves those files, so
Google, Bing and AI crawlers (ChatGPT, Claude, Perplexity — which don't run JavaScript) see the
real text, titles and schema. Re-run it after changing content in `/admin` so the static copy
matches. Always deploy the output of `build:seo`, not plain `build`.

## Studio booking system (`/studio/`)

Quotes, date availability, terms acceptance, UPI payments, crew assignment and crew checklists. Sign in at `/admin`, then open `/studio/`.

- Data lives in `public_html/studio/data/*.json` on the server. **Never overwrite or delete these when deploying** — build zips with `-x "studio/data/*.json"` (and `-x "admin/config.php"`).
- Client quote page: `/studio/q.php?t=<token>` · Crew page: `/studio/c.php?t=<token>`.
- Daily digest cron: the URL with the key is shown at the bottom of Studio → Settings.
