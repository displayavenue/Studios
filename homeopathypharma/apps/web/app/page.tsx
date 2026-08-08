import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { DoctorGrid } from "@/components/doctor-grid";
import { ProductGrid } from "@/components/product-grid";
import { brands } from "@/lib/content/brands";
import { DOCTORS } from "@/lib/content/doctors";
import { HOMEPAGE } from "@/lib/content/homepage";
import { categoryImageDataUrl } from "@/lib/content/images";
import { PRODUCTS } from "@/lib/content/products";

export default function HomePage() {
  const bestsellers = PRODUCTS.filter((p) => p.category === "Single Remedies").slice(0, 10);
  const offers = PRODUCTS.filter((p) => p.mrpInr > p.priceInr).slice(0, 8);
  const doctors = DOCTORS.slice(0, 8);
  const hero = HOMEPAGE.banners[0]!;
  const secondary = HOMEPAGE.banners.slice(1);

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero__visual" aria-hidden="true" />
        <div className="home-hero__content">
          <p className="home-hero__brand font-display">HomeopathyPharma</p>
          <h1 id="hero-heading" className="font-display">
            {hero.title}
          </h1>
          <p className="home-hero__sub">{hero.subtitle}</p>
          <div className="home-hero__cta">
            <Link href={hero.ctaHref}>
              <Button variant="accent" size="lg">
                {hero.ctaLabel}
              </Button>
            </Link>
            <Link href="/consult/">
              <Button
                variant="secondary"
                size="lg"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--hp-color-ivory-50)",
                  borderColor: "rgb(255 255 255 / 35%)",
                }}
              >
                Consult a doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="home-shell">
        <section className="home-section" aria-label="Browse categories">
          <div className="home-section__head">
            <h2 className="font-display">Shop by category</h2>
          </div>
          <ul className="category-rail" role="list">
            {HOMEPAGE.categories.map((cat) => (
              <li key={cat.label}>
                <Link href={cat.href} className="category-chip hp-focus-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImageDataUrl(cat.label, cat.seed)} alt="" width={72} height={72} />
                  <span>{cat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="promo-row" aria-label="Featured paths">
          {secondary.map((banner) => (
            <Link key={banner.id} href={banner.ctaHref} className={`promo-tile promo-tile--${banner.tone} hp-focus-ring`}>
              <p className="promo-tile__eyebrow">{banner.eyebrow}</p>
              <h2 className="font-display">{banner.title}</h2>
              <p>{banner.subtitle}</p>
              <span className="promo-tile__cta">{banner.ctaLabel} →</span>
            </Link>
          ))}
        </section>

        <section className="home-section" aria-labelledby="bestsellers-heading">
          <div className="home-section__head">
            <h2 id="bestsellers-heading" className="font-display">
              {HOMEPAGE.rails.bestsellersTitle}
            </h2>
            <Link href="/shop/bestsellers/" className="hp-link">
              See all
            </Link>
          </div>
          <ProductGrid products={bestsellers} compact />
        </section>

        <section className="consult-banner" aria-labelledby="consult-heading">
          <div>
            <h2 id="consult-heading" className="font-display">
              {HOMEPAGE.rails.consultTitle}
            </h2>
            <p>{HOMEPAGE.rails.consultBody}</p>
          </div>
          <Link href="/doctors/city/mumbai/">
            <Button variant="accent">Browse Mumbai doctors</Button>
          </Link>
        </section>

        <section className="home-section" aria-labelledby="offers-heading">
          <div className="home-section__head">
            <h2 id="offers-heading" className="font-display">
              Deals below MRP
            </h2>
            <Link href="/shop/offers/" className="hp-link">
              All offers
            </Link>
          </div>
          <ProductGrid products={offers} compact />
        </section>

        <section className="home-section" aria-labelledby="brands-heading">
          <div className="home-section__head">
            <h2 id="brands-heading" className="font-display">
              {HOMEPAGE.rails.brandsTitle}
            </h2>
            <Link href="/brands/" className="hp-link">
              All brands
            </Link>
          </div>
          <ul className="brand-rail" role="list">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link href={`/brands/${brand.slug}/`} className="brand-pill hp-focus-ring">
                  <strong>{brand.name}</strong>
                  <span>{brand.productCount} products</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="doctors-heading">
          <div className="home-section__head">
            <h2 id="doctors-heading" className="font-display">
              {HOMEPAGE.rails.doctorsTitle}
            </h2>
            <Link href="/doctors/" className="hp-link">
              View all {DOCTORS.length}
            </Link>
          </div>
          <DoctorGrid doctors={doctors} compact />
        </section>
      </div>
    </div>
  );
}
