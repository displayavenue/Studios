import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { DoctorGrid } from "@/components/doctor-grid";
import { HomeBannerCarousel } from "@/components/home-banner-carousel";
import { ProductGrid } from "@/components/product-grid";
import { featuredBrands } from "@/lib/content/brands";
import { DOCTORS } from "@/lib/content/doctors";
import { HOMEPAGE } from "@/lib/content/homepage";
import { brandImageSrc, categoryImageSrc } from "@/lib/content/images";
import { PRODUCTS } from "@/lib/content/products";

export default function HomePage() {
  const bestsellers = PRODUCTS.filter((p) =>
    ["sbl", "dr-reckeweg", "schwabe"].includes(p.brandSlug),
  ).slice(0, 12);
  const offers = PRODUCTS.filter(
    (p) => p.mrpInr > p.priceInr && ["sbl", "dr-reckeweg", "schwabe"].includes(p.brandSlug),
  ).slice(0, 10);
  const doctors = DOCTORS.slice(0, 8);
  const majorBrands = featuredBrands();

  return (
    <div className="home home--mg">
      <HomeBannerCarousel />

      <div className="home-shell">
        <section className="home-section" aria-labelledby="concerns-heading">
          <div className="home-section__head">
            <h2 id="concerns-heading" className="font-display">
              Shop by health concern
            </h2>
            <Link href="/shop/categories/" className="hp-link">
              See all
            </Link>
          </div>
          <ul className="mg-concern-rail" role="list">
            {HOMEPAGE.categories.slice(0, 10).map((cat) => (
              <li key={cat.label}>
                <Link href={cat.href} className="mg-concern hp-focus-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImageSrc(cat.seed)} alt="" width={88} height={88} />
                  <span>{cat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="brands-heading">
          <div className="home-section__head">
            <h2 id="brands-heading" className="font-display">
              {HOMEPAGE.rails.brandsTitle}
            </h2>
            <Link href="/brands/" className="hp-link">
              See all
            </Link>
          </div>
          <ul className="mg-brand-rail" role="list">
            {majorBrands.map((brand) => (
              <li key={brand.slug}>
                <Link href={`/brands/${brand.slug}/`} className="mg-brand-card hp-focus-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brandImageSrc(brand.slug)} alt="" width={160} height={160} />
                  <strong>{brand.name}</strong>
                  <span>{brand.productCount} products</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="bestsellers-heading">
          <div className="home-section__head">
            <h2 id="bestsellers-heading" className="font-display">
              {HOMEPAGE.rails.bestsellersTitle}
            </h2>
            <Link href="/shop/" className="hp-link">
              See all
            </Link>
          </div>
          <ProductGrid products={bestsellers} compact />
        </section>

        <section className="mg-consult-strip" aria-labelledby="consult-heading">
          <div>
            <h2 id="consult-heading" className="font-display">
              {HOMEPAGE.rails.consultTitle}
            </h2>
            <p>{HOMEPAGE.rails.consultBody}</p>
          </div>
          <Link href="/doctors/city/mumbai/">
            <Button variant="accent" size="lg">
              Browse Mumbai doctors
            </Button>
          </Link>
        </section>

        <section className="home-section" aria-labelledby="offers-heading">
          <div className="home-section__head">
            <h2 id="offers-heading" className="font-display">
              Super saving deals
            </h2>
            <Link href="/shop/offers/" className="hp-link">
              See all
            </Link>
          </div>
          <ProductGrid products={offers} compact />
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
