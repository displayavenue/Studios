import { Link } from "react-router-dom";
import type { RefObject } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO, FAQPageSchema } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { GoogleReviews } from "../components/GoogleReviews";
import { AwardsCertsHome } from "../components/AwardsCertsHome";
import {
  BrandTypeOn,
  CountStat,
  LogoMarquee,
  MobileSwipeRail,
  RotatingKeywords,
  WordReveal,
} from "../components/motion/MotionBits";
import { PreferredSources } from "../components/PreferredSources";
import "./Home.css";

const promises = [
  {
    title: "Get found online",
    text: "Show up when people search for what you sell  -  on Google and maps.",
  },
  {
    title: "Turn visits into calls",
    text: "Ads, posts, and a clear website that make people reach out to you.",
  },
  {
    title: "Know what works",
    text: "Simple monthly updates in plain language  -  so you see where money goes.",
  },
];

const plainServices = [
  {
    title: "Google & local search",
    desc: "Help customers find your business when they need you.",
    href: "/services/seo",
    icon: "search" as const,
  },
  {
    title: "Ads that bring enquiries",
    desc: "Google and Instagram ads aimed at people ready to buy.",
    href: "/services/google-ads",
    icon: "target" as const,
  },
  {
    title: "Website that converts",
    desc: "A clear site that explains your offer and captures leads.",
    href: "/services/web-development",
    icon: "globe" as const,
  },
  {
    title: "Brand & creative",
    desc: "Look trustworthy  -  logos, creatives, and content people remember.",
    href: "/services/branding",
    icon: "brand" as const,
  },
  {
    title: "Social media growth",
    desc: "Consistent content and campaigns that keep your brand visible.",
    href: "/services/social-media",
    icon: "chat" as const,
  },
  {
    title: "AI & automation",
    desc: "Practical AI workflows that save time and speed follow-up.",
    href: "/ai-platform",
    icon: "chip" as const,
  },
];

const processSteps = [
  { n: "01", title: "Discover", text: "Goals, offer, and where enquiries are leaking." },
  { n: "02", title: "Strategy", text: "A plain 30-day plan for Google, ads, or website." },
  { n: "03", title: "Create", text: "Pages, creatives, tracking, and WhatsApp paths." },
  { n: "04", title: "Launch", text: "Go live with clear ownership and weekly checks." },
  { n: "05", title: "Optimize", text: "Improve cost per enquiry — not vanity clicks." },
  { n: "06", title: "Grow", text: "Expand channels once the engine is predictable." },
];

const HERO_IMAGE_FALLBACK = "/images/hero-agency-india.jpg";

/** Visible FAQ + FAQPage schema: the format AI answer engines quote most. */
const homeFaqs = [
  {
    question: "What does DisplayAvenue do?",
    answer:
      "DisplayAvenue is a digital marketing agency that helps businesses get more customers online. We run Google Ads and Meta (Facebook & Instagram) ads, do SEO and Google Business Profile optimisation, manage social media, and build websites and landing pages that turn visitors into enquiries.",
  },
  {
    question: "Where is DisplayAvenue located?",
    answer:
      "Our office is at Office No. 44, D Wing, Shree Sharanam CHS, Unique Garden, Kanakia, Mira Road East, Mumbai 401107. We work with clients across Mumbai, Thane, the rest of India and abroad, in person or online.",
  },
  {
    question: "Is DisplayAvenue a certified Google and Meta partner?",
    answer:
      "Yes. DisplayAvenue is a Google Partner with Google Ads certifications and a Meta Business Partner. We have been running campaigns for Indian businesses since 2018.",
  },
  {
    question: "How much does digital marketing cost with DisplayAvenue?",
    answer:
      "We offer clear monthly plans for SEO, Google Ads, social media and lead generation, plus one-time website projects. Your ad budget is paid directly to Google or Meta and is separate from our management fee. Book a free call and we will recommend a plan that fits your goals and budget.",
  },
  {
    question: "How soon will I see results?",
    answer:
      "Google and Meta ads can start bringing enquiries within the first one to two weeks after launch. SEO and Google Business Profile growth usually take three to six months to build steady, free traffic. We share simple monthly reports so you can see what is working.",
  },
  {
    question: "Which businesses do you work with?",
    answer:
      "We work with small and growing businesses in India, including real estate, healthcare and clinics, education, travel, retail and e-commerce, B2B manufacturers and exporters, and local service businesses.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free call or WhatsApp us on +91 9222 122333. We will review your current marketing, show you what to fix first, and share a clear plan in plain English, with no obligation.",
  },
];

export function Home() {
  const { company, home, content, googleReviews } = useCms();
  const rating = Number(googleReviews?.rating || 0);
  const reviewCount = Number(googleReviews?.reviewCount || 0);
  const revealRef = useReveal();
  const hero = home.hero as typeof home.hero & { image?: string; imageAlt?: string };
  const seoTitle = home.seo?.title || `${company.name} | Digital Marketing Agency in Mumbai`;
  const seoDesc = home.seo?.description || home.hero.lead;
  const quotes = content.testimonials.slice(0, 5);
  const logos = content.clientLogos.slice(0, 10);
  const heroSrc = hero.image || HERO_IMAGE_FALLBACK;
  const headline = `${home.hero.titleBefore} ${home.hero.titleAccent}`.trim();

  return (
    <div className="home-page" ref={revealRef as RefObject<HTMLDivElement>}>
      <SEO title={seoTitle} description={seoDesc} path="/" />

      <section className="home-hero" aria-label="Introduction">
        <div className="home-hero__media" aria-hidden>
          <picture>
            {heroSrc === HERO_IMAGE_FALLBACK && (
              <source
                type="image/webp"
                srcSet="/images/hero-agency-india-768.webp 768w, /images/hero-agency-india-1200.webp 1200w, /images/hero-agency-india-1536.webp 1536w"
                sizes="(min-width: 980px) 44vw, 100vw"
              />
            )}
            <img
              src={heroSrc}
              alt={hero.imageAlt || "DisplayAvenue digital marketing team at work in Mumbai"}
              width={1536}
              height={1024}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="home-hero__shade" aria-hidden />
        <div className="home-hero__glow" aria-hidden />
        <div className="home-hero__inner">
          <div className="home-hero__copy">
          <p className="home-hero__brand">
            <BrandTypeOn text={home.hero.eyebrow || company.name} />
          </p>
          <h1>
            <WordReveal text={headline} />
          </h1>
          <RotatingKeywords />
          <p className="home-hero__lead">{home.hero.lead}</p>
          <div className="home-hero__actions">
            <Link to="/contact" className="btn btn-primary btn-shimmer">
              {home.hero.primaryCta}
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </Link>
            <Link to="/portfolio" className="btn btn-outline-light">
              {home.hero.secondaryCta}
            </Link>
          </div>
          <ul className="home-hero__trust" aria-label="Why businesses trust DisplayAvenue">
            {rating > 0 && (
              <li>
                <span className="home-hero__stars" aria-hidden>
                  ★★★★★
                </span>
                <strong>{rating.toFixed(1)}</strong> on Google
                {reviewCount > 0 && <span> · {reviewCount} reviews</span>}
              </li>
            )}
            <li>Google Partner</li>
            <li>Meta Business Partner</li>
            <li>Since 2018</li>
          </ul>
          </div>
          <div className="home-hero__visual" aria-hidden>
            <div className="home-hero__chip home-hero__chip--a">
              <span className="home-hero__chip-dot" />
              New enquiry · Google Ads
            </div>
            <div className="home-hero__chip home-hero__chip--b">
              <strong>{company.stats.clients}</strong> businesses served
            </div>
            <div className="home-hero__chip home-hero__chip--c">
              <strong>Mira Road, Mumbai</strong> · Pan-India
            </div>
          </div>
        </div>
      </section>

      <section className="home-block home-block--soft">
        <div className="container">
          <p className="home-kicker reveal">Proof in numbers</p>
          <h2 className="home-title reveal reveal-delay-1">Results Indian SMEs care about</h2>
          <div className="home-stats">
            <CountStat value={company.stats.projects} label="Projects delivered" className="reveal-delay-1" />
            <CountStat value={company.stats.satisfaction} label="Client satisfaction" className="reveal-delay-2" />
            <CountStat value={company.stats.avgRoi} label="Avg. reported ROI lift" className="reveal-delay-3" />
            <CountStat value={company.stats.clients} label="Businesses served" className="reveal-delay-4" />
          </div>
        </div>
      </section>

      <section className="home-block home-block--soft home-block--tight-top">
        <div className="container">
          <p className="home-kicker reveal">{home.trustLabel}</p>
          <h2 className="home-title reveal reveal-delay-1">How we help your business grow</h2>
          <p className="home-sub reveal reveal-delay-2">
            Three plain goals. No buzzwords  -  just more of the right people finding you and getting
            in touch.
          </p>
          <div className="home-promises">
            {promises.map((item, i) => (
              <article key={item.title} className={`home-promise reveal reveal-delay-${i + 1}`}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-block home-block--navy">
        <div className="container">
          <p className="home-kicker reveal">What we do</p>
          <h2 className="home-title reveal reveal-delay-1">{home.servicesTitle}</h2>
          <p className="home-sub reveal reveal-delay-2">{home.servicesSub}</p>

          <div className="home-services home-services--desktop">
            {plainServices.map((service, i) => (
              <Link
                key={service.href}
                to={service.href}
                className={`home-service reveal reveal-delay-${(i % 3) + 1}`}
              >
                <span className="icon-box" style={{ background: "rgba(158,193,255,0.16)" }}>
                  <Icon name={service.icon} color="#9ec1ff" />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
                <Icon name="arrow" size={16} color="#9ec1ff" />
              </Link>
            ))}
          </div>

          <div className="home-services-mobile">
            <MobileSwipeRail label="Services">
              {plainServices.map((service) => (
                <Link key={service.href} to={service.href} className="home-service home-service--card">
                  <span
                    className={`icon-box home-service__icon home-service__icon--${service.icon}`}
                    style={{ background: "rgba(158,193,255,0.16)" }}
                  >
                    <Icon name={service.icon} color="#9ec1ff" />
                  </span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                  <span className="home-service__cta">
                    Explore <Icon name="arrow" size={14} color="#9ec1ff" />
                  </span>
                </Link>
              ))}
            </MobileSwipeRail>
          </div>

          <div className="reveal" style={{ marginTop: "1.5rem" }}>
            <Link to="/services" className="btn btn-ghost">
              See all services →
            </Link>
          </div>
        </div>
      </section>

      <section className="home-block home-block--soft">
        <div className="container">
          <p className="home-kicker reveal">How we work</p>
          <h2 className="home-title reveal reveal-delay-1">A clear process — not chaos</h2>
          <ol className="home-process">
            {processSteps.map((step, i) => (
              <li key={step.n} className={`home-process__item reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="home-process__n">{step.n}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {quotes.length > 0 && (
        <section className="home-block home-block--soft">
          <div className="container">
            <p className="home-kicker reveal">From business owners like you</p>
            <h2 className="home-title reveal reveal-delay-1">Client voices</h2>
            <div className="home-quotes-desktop">
              <blockquote className="home-quote reveal reveal-delay-1">
                <p>“{quotes[0].quote}”</p>
                <footer>
                  <strong>{quotes[0].name}</strong>
                  <span>{quotes[0].title}</span>
                </footer>
              </blockquote>
            </div>
            <div className="home-quotes-mobile">
              <MobileSwipeRail label="Testimonials">
                {quotes.map((q) => (
                  <blockquote key={q.name} className="home-quote home-quote--card">
                    <span className="home-quote__mark" aria-hidden>
                      “
                    </span>
                    <p>{q.quote}</p>
                    <footer>
                      <strong>{q.name}</strong>
                      <span>{q.title}</span>
                    </footer>
                  </blockquote>
                ))}
              </MobileSwipeRail>
            </div>
            <div className="reveal reveal-delay-2" style={{ marginTop: "1.5rem" }}>
              <Link to="/case-studies" className="link-arrow">
                Read more client stories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {logos.length > 0 && (
        <section className="home-block home-block--navy home-block--logos">
          <div className="container">
            <p className="home-kicker reveal">Trusted by growing brands</p>
            <h2 className="home-title reveal reveal-delay-1">Clients & partners</h2>
            <div className="reveal reveal-delay-2" style={{ marginTop: "1.25rem" }}>
              <LogoMarquee logos={logos} />
            </div>
          </div>
        </section>
      )}

      <section className="home-block home-block--navy">
        <div className="container home-cta">
          <p className="home-kicker reveal">Next step</p>
          <h2 className="home-title reveal reveal-delay-1">
            Tell us about your business. We’ll show a clear plan.
          </h2>
          <p className="home-sub reveal reveal-delay-2">
            Free call. No hard sell. We’ll explain what to fix first  -  in language that makes sense.
          </p>
          <Link to="/contact" className="btn btn-primary btn-shimmer reveal reveal-delay-3">
            Book a free call
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
          <div className="reveal reveal-delay-4" style={{ marginTop: "1.25rem" }}>
            <PreferredSources theme="dark" className="preferred-sources--home" />
          </div>
        </div>
      </section>

      <GoogleReviews />
      <AwardsCertsHome />

      <section className="home-block home-block--soft home-faq" aria-labelledby="home-faq-title">
        <FAQPageSchema faqs={homeFaqs} />
        <div className="container">
          <p className="home-kicker reveal">Questions, answered</p>
          <h2 id="home-faq-title" className="home-title reveal reveal-delay-1">
            Frequently asked questions
          </h2>
          <div className="home-faq__list">
            {homeFaqs.map((f, i) => (
              <details key={f.question} className="home-faq__item" open={i === 0}>
                <summary>
                  <h3>{f.question}</h3>
                  <span className="home-faq__icon" aria-hidden />
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
