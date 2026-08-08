import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { DoctorGrid } from "@/components/doctor-grid";
import { ProductGrid } from "@/components/product-grid";
import { featuredBrands } from "@/lib/content/brands";
import { DOCTORS } from "@/lib/content/doctors";
import { HOMEPAGE } from "@/lib/content/homepage";
import { categoryImageDataUrl, heroApothecaryImageDataUrl } from "@/lib/content/images";
import { PRODUCTS } from "@/lib/content/products";

export default function HomePage() {
  const bestsellers = PRODUCTS.filter((p) =>
    ["sbl", "dr-reckeweg", "schwabe"].includes(p.brandSlug),
  ).slice(0, 10);
  const doctors = DOCTORS.slice(0, 6);
  const hero = HOMEPAGE.banners[0]!;
  const majorBrands = featuredBrands();
  const heroImage = heroApothecaryImageDataUrl();

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-heading">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="home-hero__media" src={heroImage} alt="" width={1600} height={1000} />
        <div className="home-hero__shade" aria-hidden="true" />
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
                  borderColor: "rgb(255 255 255 / 40%)",
                }}
              >
                Consult a doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="home-shell">
        <section className="home-section home-section--brands" aria-labelledby="brands-heading">
          <div className="home-section__head">
            <div>
              <h2 id="brands-heading" className="font-display">
                {HOMEPAGE.rails.brandsTitle}
              </h2>
              <p className="home-section__lede">Start with the catalogues people ask for most.</p>
            </div>
            <Link href="/brands/" className="hp-link">
              All brands
            </Link>
          </div>
          <ul className="home-brand-row" role="list">
            {majorBrands.map((brand, index) => (
              <li key={brand.slug} style={{ animationDelay: `${index * 80}ms` }}>
                <Link href={`/brands/${brand.slug}/`} className="home-brand-link hp-focus-ring">
                  <strong className="font-display">{brand.name}</strong>
                  <span>{brand.productCount} products</span>
                  <em>Shop {brand.name}</em>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="bestsellers-heading">
          <div className="home-section__head">
            <div>
              <h2 id="bestsellers-heading" className="font-display">
                {HOMEPAGE.rails.bestsellersTitle}
              </h2>
              <p className="home-section__lede">Clear potencies and pack sizes — educational listings only.</p>
            </div>
            <Link href="/shop/" className="hp-link">
              Browse shop
            </Link>
          </div>
          <ProductGrid products={bestsellers} compact />
        </section>

        <section className="home-consult" aria-labelledby="consult-heading">
          <div className="home-consult__copy">
            <h2 id="consult-heading" className="font-display">
              {HOMEPAGE.rails.consultTitle}
            </h2>
            <p>{HOMEPAGE.rails.consultBody}</p>
          </div>
          <Link href="/doctors/city/mumbai/" className="home-consult__action">
            <Button variant="accent" size="lg">
              Browse Mumbai doctors
            </Button>
          </Link>
        </section>

        <section className="home-section" aria-labelledby="categories-heading">
          <div className="home-section__head">
            <div>
              <h2 id="categories-heading" className="font-display">
                Shop by category
              </h2>
              <p className="home-section__lede">Browse the full catalogue by body system and wellness theme.</p>
            </div>
            <Link href="/shop/categories/" className="hp-link">
              All categories
            </Link>
          </div>
          <ul className="home-category-row" role="list">
            {HOMEPAGE.categories.slice(0, 8).map((cat) => (
              <li key={cat.label}>
                <Link href={cat.href} className="home-category-link hp-focus-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImageDataUrl(cat.label, cat.seed)} alt="" width={72} height={72} />
                  <span>{cat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="doctors-heading">
          <div className="home-section__head">
            <div>
              <h2 id="doctors-heading" className="font-display">
                {HOMEPAGE.rails.doctorsTitle}
              </h2>
              <p className="home-section__lede">Listed BHMS profiles for online and clinic appointments.</p>
            </div>
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
