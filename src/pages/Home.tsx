import { Link } from "react-router-dom";
import { SEO, OrganizationSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Home.css";

export function Home() {
  const ref = useReveal<HTMLDivElement>();
  const {
    company: { trustBadges, brandLogos },
    homeServices,
    services,
    packageGroups,
    portfolio,
    blogs,
    faqs,
    processSteps,
    testimonials,
    whyChoose,
  } = useCms();
  const weddingPackages = packageGroups[0];

  return (
    <div ref={ref}>
      <SEO
        title="DisplayAvenue Studios | India's Premium Visual Production Studio"
        description="Luxury wedding photography, cinematic films, commercial productions, product photography and visual storytelling across India. Book DisplayAvenue Studios."
        path="/"
      />
      <OrganizationSchema />

      <section className="home-hero">
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <p className="home-hero__brand">DisplayAvenue Studios</p>
            <p className="eyebrow home-hero__label">
              Premium Photography • Videography • Film Production
            </p>
            <h1>India&apos;s Premium Visual Production Studio</h1>
            <p className="home-hero__desc">
              Luxury wedding photography, cinematic films, commercial
              productions, product photography and visual storytelling across
              India.
            </p>
            <div className="home-hero__actions">
              <Link to="/book-now" className="btn btn--gold">
                Book Your Shoot
              </Link>
              <Link to="/portfolio" className="btn btn--outline">
                View Portfolio
              </Link>
            </div>
            <ul className="trust-badges">
              {trustBadges.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>
          </div>
          <div className="home-hero__media">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80"
              alt="Indian bride and groom at a luxury wedding photographed by DisplayAvenue Studios"
              width={800}
              height={1000}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="brands-strip section">
        <div className="container">
          <p className="brands-strip__label reveal">Trusted by Brands</p>
          <div className="brands-strip__row reveal">
            {brandLogos.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Services</p>
            <h2>Visual production for every celebration and brand</h2>
            <p>
              From luxury weddings to commercial campaigns, our Mumbai-based
              studio delivers pan-India photography, videography and post
              production.
            </p>
          </div>
          <div className="services-grid">
            {homeServices.map((slug, i) => {
              const service = services.find((s) => s.slug === slug);
              if (!service) return null;
              return (
                <Link
                  key={slug}
                  to={`/services/${slug}`}
                  className="service-card card reveal"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="service-card__img">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.short}</p>
                    <span className="text-link">Explore service →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="section-cta reveal">
            <Link to="/services" className="btn btn--dark">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Featured Portfolio</p>
            <h2>Work that feels expensive on purpose</h2>
            <p>
              A selection of weddings, brand films, hospitality and commercial
              projects produced by DisplayAvenue Studios.
            </p>
          </div>
          <div className="masonry">
            {portfolio.slice(0, 8).map((item, i) => (
              <Link
                key={item.slug}
                to={`/portfolio/${item.slug}`}
                className={`masonry__item reveal ${i % 5 === 0 ? "is-tall" : ""}`}
              >
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.category} project in ${item.location}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                />
                <div className="masonry__overlay">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <em>{item.location}</em>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to="/portfolio" className="btn btn--gold">
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Packages</p>
            <h2>Essential · Signature · Luxury</h2>
            <p>
              Transparent wedding packages designed for intimate ceremonies and
              destination celebrations. Compare and customise with our team.
            </p>
          </div>
          <div className="packages-grid">
            {weddingPackages.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`package-card card reveal ${tier.highlighted ? "is-featured" : ""}`}
              >
                {tier.highlighted && (
                  <span className="package-card__badge">Most Popular</span>
                )}
                <h3>{tier.name}</h3>
                <p className="package-card__price">{tier.priceLabel}</p>
                <p className="package-card__note">{tier.priceNote}</p>
                <p>{tier.description}</p>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/book-now" className="btn btn--gold">
                  Book Now
                </Link>
              </article>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to={`/packages/${weddingPackages.slug}`} className="btn btn--gold">
              Wedding Package Page
            </Link>
            <Link to="/packages" className="btn btn--outline">
              All Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Why Choose DisplayAvenue Studios</h2>
            <p>
              Built for premium clients who expect cinema-grade craft,
              reliable coordination and a luxury experience from inquiry to
              delivery.
            </p>
          </div>
          <div className="why-grid">
            {whyChoose.map((item) => (
              <article key={item.title} className="why-card card reveal">
                <div className="why-card__icon" aria-hidden>
                  ◆
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">How We Work</p>
            <h2>A clear path from inquiry to delivery</h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.step} className="process-card reveal">
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Testimonials</p>
            <h2>Loved by couples, brands and hotels</h2>
            <p>
              Google-ready reviews from weddings, product launches and
              hospitality projects across India.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.name} className="testimonial-card card reveal">
                <div className="testimonial-card__stars" aria-label="5 star review">
                  ★★★★★
                </div>
                <p className="testimonial-card__quote">“{t.quote}”</p>
                <div className="testimonial-card__person">
                  <img src={t.image} alt={t.name} loading="lazy" width={56} height={56} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container faq-home">
          <div className="section-head reveal">
            <p className="eyebrow">FAQs</p>
            <h2>Questions couples and brands ask first</h2>
            <p>
              Clear answers on booking, pricing, travel and delivery. Browse the
              full FAQ library for more.
            </p>
            <Link to="/faqs" className="btn btn--ghost" style={{ marginTop: "1.25rem" }}>
              View All FAQs
            </Link>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Latest Blogs</p>
            <h2>Guides for planning, booking and better visuals</h2>
          </div>
          <div className="blog-grid">
            {blogs.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="blog-card card reveal"
              >
                <div className="blog-card__img">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    width={640}
                    height={420}
                  />
                </div>
                <div className="blog-card__body">
                  <span>
                    {post.category} · {post.readTime}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to="/blog" className="btn btn--outline">
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
