# DisplayAvenue Studios

Premium website for **DisplayAvenue Studios** - India's Premium Visual Production Studio.

> **Agency demo (separate):** see [`agency/`](agency/) for the **DisplayAvenue** digital growth agency site targeting [displayavenue.com](https://displayavenue.com). Run with `cd agency && npm install && npm run dev`.

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
3. Login - default password in `admin/config.php`: `DisplayAdmin@2026` (**change it**)
4. Edit company info, services, packages, portfolio, blogs, FAQs, team, etc.
5. Click **Save changes** - refresh the website to see updates

Ensure the `content/` folder is writable (chmod 755/775).

## Pages

Home, About, Services (+ detail), Packages, Pricing, Portfolio (+ detail), Industries, Locations (+ detail), Blog, FAQs, Book Now, Contact.

Company: [displayavenuestudios.com](https://displayavenuestudios.com) · Mumbai · Pan India
