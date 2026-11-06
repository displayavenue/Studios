# Pragati Institute of Life Skills: concept site

An original sample website for a life-skills institute that offers assessments, courses, coaching and programmes for colleges and companies. "Pragati" is a placeholder brand and all the text is original.

The whole site is plain HTML, CSS and a small JavaScript file. There's no build step, framework or server code.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home: hero with a sample report, how it works, audiences, featured products, coaching, FAQ |
| `assessments.html` | 6 assessments with search and filters |
| `courses.html` | 6 courses (self-paced and live) with search and filters |
| `coaching.html` | 3 coaching plans |
| `institutions.html` | Offers for colleges and companies |
| `about.html` | Mission, principles, and team placeholders |
| `contact.html` | Enquiry form (sends by WhatsApp or email) and FAQ |
| `policies.html` | Terms, privacy and refunds (placeholder text) |
| `404.html` | Not-found page |

## Before going live

1. **Brand:** search and replace `Pragati` / `Pragati Institute of Life Skills`, and swap `assets/logo.svg`, `favicon.svg` and `assets/og-image.png`.
2. **Contact details:** set `email` and `whatsapp` at the top of `assets/app.js`, and update the office address in `contact.html`.
3. **Domain:** replace `https://www.example.com` in every page's `<head>`, plus `sitemap.xml` and `robots.txt`.
4. **Products and prices:** edit the cards in `assessments.html` and `courses.html`. Each card's `data-*` attributes control the filters.
5. **Team and policies:** fill in `about.html` and have a lawyer review `policies.html`.
6. **Colours:** all colours are tokens at the top of `assets/styles.css`. Light and dark modes are both included.

The "Start", "Enrol" and "Book" buttons open the contact form with the product already selected. To take payments directly, point those buttons at Razorpay Payment Pages or a similar hosted checkout.

## Deploy

- **Hostinger or any Apache host:** upload the contents of this folder (or unzip `life-skills-institute.zip`) into `public_html`. `.htaccess` sets up the 404 page, compression and caching.
- **Netlify, Vercel or Cloudflare Pages:** drag the folder in, or connect the repo with this folder as the publish directory. There's no build command.
- **Local preview:** `python3 -m http.server` in this folder, then open http://localhost:8000.
