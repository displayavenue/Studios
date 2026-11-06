import { Link } from "react-router-dom";
import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { GoogleReviews } from "../components/GoogleReviews";
import { AwardsCertsHome } from "../components/AwardsCertsHome";
import { CountStat, LogoMarquee, RotatingKeywords } from "../components/motion/MotionBits";
import { PreferredSources } from "../components/PreferredSources";
import { SignalDemo, type SignalScene } from "../components/home/SignalDemo";
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

/** Which word in the headline lights up for each hero scene. */
const CHANNEL_MATCH: Record<SignalScene, RegExp> = {
  google: /^google/i,
  instagram: /^instagram/i,
  website: /^website/i,
};

function Headline({ text, scene }: { text: string; scene: SignalScene }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <h1 className="hx-title" aria-label={text}>
      {words.map((w, i) => {
        const channel = (Object.keys(CHANNEL_MATCH) as SignalScene[]).find((k) =>
          CHANNEL_MATCH[k].test(w),
        );
        return (
          <Fragment key={`${w}-${i}`}>
            <span className="hx-word" aria-hidden>
              <span
                className={`hx-word__in${channel ? " hx-channel" : ""}${
                  channel && channel === scene ? " is-live" : ""
                }`}
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </h1>
  );
}

function ProcessScroller() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const progress = ((active + 1) / processSteps.length) * 100;

  return (
    <div className="hx-process">
      <div className="hx-process__aside">
        <p className="hx-kicker reveal">How we work</p>
        <h2 className="hx-h2 reveal reveal-delay-1">A clear process — not chaos</h2>
        <div className="hx-process__meter" aria-hidden>
          <strong>{processSteps[active].n}</strong>
          <span>/ {String(processSteps.length).padStart(2, "0")}</span>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ol className="hx-process__list" ref={listRef}>
        {processSteps.map((step, i) => (
          <li
            key={step.n}
            className={`hx-step${i === active ? " is-active" : ""}${i < active ? " is-past" : ""}`}
          >
            <span className="hx-step__n">{step.n}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type Quote = { quote: string; name: string; title: string };

function QuoteSlider({ quotes }: { quotes: Quote[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = quotes.length;

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), 7000);
    return () => window.clearTimeout(id);
  }, [i, paused, n]);

  const q = quotes[i];
  return (
    <div
      className="hx-quotes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="hx-quotes__mark" aria-hidden>
        “
      </span>
      <blockquote key={i} className="hx-quote" aria-live="polite">
        <p>{q.quote}</p>
        <footer>
          <strong>{q.name}</strong>
          <span>{q.title}</span>
        </footer>
      </blockquote>
      {n > 1 && (
        <div className="hx-quotes__nav">
          <div className="hx-quotes__dots" role="tablist" aria-label="Client quotes">
            {quotes.map((item, k) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={`Quote from ${item.name}`}
                className={k === i ? "is-on" : ""}
                onClick={() => setI(k)}
              >
                <i style={{ animationPlayState: paused ? "paused" : "running" }} />
              </button>
            ))}
          </div>
          <div className="hx-quotes__arrows">
            <button type="button" aria-label="Previous quote" onClick={() => setI((i - 1 + n) % n)}>
              <Icon name="arrow" size={16} color="currentColor" />
            </button>
            <button type="button" aria-label="Next quote" onClick={() => setI((i + 1) % n)}>
              <Icon name="arrow" size={16} color="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Home() {
  const { company, home, content } = useCms();
  const revealRef = useReveal();
  const [scene, setScene] = useState<SignalScene>("google");
  const hero = home.hero as typeof home.hero & { image?: string; imageAlt?: string };
  const seoTitle = home.seo?.title || `${company.name} | Get more customers online`;
  const seoDesc = home.seo?.description || home.hero.lead;
  const quotes = content.testimonials.slice(0, 5);
  const logos = content.clientLogos.slice(0, 10);
  const headline = `${home.hero.titleBefore} ${home.hero.titleAccent}`.trim();

  return (
    <div className="home-page hx" ref={revealRef as RefObject<HTMLDivElement>}>
      <SEO title={seoTitle} description={seoDesc} path="/" />

      {/* ---------- Hero ---------- */}
      <section className="hx-hero" aria-label="Introduction">
        <div className="hx-hero__grid-bg" aria-hidden />
        <div className="container-wide hx-hero__inner">
          <div className="hx-hero__copy">
            <p className="hx-hero__eyebrow">
              <span className="hx-live-dot" aria-hidden />
              {home.hero.eyebrow || company.name}
            </p>
            <Headline text={headline} scene={scene} />
            <div className="hx-hero__rotator">
              <RotatingKeywords />
            </div>
            <p className="hx-hero__lead">{home.hero.lead}</p>
            <div className="hx-hero__actions">
              <Link to="/contact" className="btn btn-primary hx-btn-lg">
                {home.hero.primaryCta}
                <Icon name="arrow" size={16} color="currentColor" />
              </Link>
              <Link to="/portfolio" className="btn btn-outline-light hx-btn-lg">
                {home.hero.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="hx-hero__demo">
            <SignalDemo onScene={setScene} />
          </div>
        </div>

        {/* stats live inside the hero band */}
        <div className="container-wide">
          <div className="hx-stats" aria-label="Proof in numbers">
            <p className="hx-stats__label reveal">Results Indian SMEs care about</p>
            <CountStat value={company.stats.projects} label="Projects delivered" className="reveal-delay-1" />
            <CountStat value={company.stats.satisfaction} label="Client satisfaction" className="reveal-delay-2" />
            <CountStat value={company.stats.avgRoi} label="Avg. reported ROI lift" className="reveal-delay-3" />
            <CountStat value={company.stats.clients} label="Businesses served" className="reveal-delay-4" />
          </div>
        </div>
      </section>

      {/* ---------- Promise ---------- */}
      <section className="hx-section hx-paper">
        <div className="container hx-promise">
          <div className="hx-promise__head">
            <p className="hx-kicker reveal">{home.trustLabel}</p>
            <h2 className="hx-h2 reveal reveal-delay-1">How we help your business grow</h2>
            <p className="hx-sub reveal reveal-delay-2">
              Three plain goals. No buzzwords  -  just more of the right people finding you and getting
              in touch.
            </p>
          </div>
          <figure className="hx-promise__media reveal-scale">
            <img
              src={hero.image || HERO_IMAGE_FALLBACK}
              alt={hero.imageAlt || ""}
              width={2000}
              height={1333}
              loading="lazy"
            />
          </figure>
          <div className="hx-promise__list">
            {promises.map((item, i) => (
              <article key={item.title} className={`hx-promise__item reveal reveal-delay-${i + 1}`}>
                <span className="hx-promise__icon" aria-hidden>
                  <Icon
                    name={(["search", "chat", "chart"] as const)[i] ?? "check"}
                    size={20}
                    color="currentColor"
                  />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="hx-section hx-ink">
        <div className="container">
          <div className="hx-split-head">
            <div>
              <p className="hx-kicker reveal">What we do</p>
              <h2 className="hx-h2 reveal reveal-delay-1">{home.servicesTitle}</h2>
            </div>
            <p className="hx-sub reveal reveal-delay-2">{home.servicesSub}</p>
          </div>

          <ul className="hx-services">
            {plainServices.map((service, i) => (
              <li key={service.href} className={`reveal reveal-delay-${(i % 3) + 1}`}>
                <Link to={service.href} className="hx-service">
                  <span className="hx-service__icon" aria-hidden>
                    <Icon name={service.icon} size={22} color="currentColor" />
                  </span>
                  <span className="hx-service__title">{service.title}</span>
                  <span className="hx-service__desc">{service.desc}</span>
                  <span className="hx-service__go" aria-hidden>
                    <Icon name="arrow" size={18} color="currentColor" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="reveal" style={{ marginTop: "2.5rem" }}>
            <Link to="/services" className="btn btn-outline-light">
              See all services
              <Icon name="arrow" size={16} color="currentColor" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="hx-section hx-paper">
        <div className="container">
          <ProcessScroller />
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      {quotes.length > 0 && (
        <section className="hx-section hx-sky">
          <div className="container">
            <div className="hx-split-head">
              <div>
                <p className="hx-kicker reveal">From business owners like you</p>
                <h2 className="hx-h2 reveal reveal-delay-1">Client voices</h2>
              </div>
              <Link to="/case-studies" className="link-arrow reveal reveal-delay-2">
                Read more client stories →
              </Link>
            </div>
            <div className="reveal reveal-delay-2">
              <QuoteSlider quotes={quotes} />
            </div>
          </div>
        </section>
      )}

      {/* ---------- Logos ---------- */}
      {logos.length > 0 && (
        <section className="hx-logos hx-ink">
          <div className="container hx-logos__head">
            <p className="hx-kicker reveal">Trusted by growing brands</p>
            <h2 className="hx-h3 reveal reveal-delay-1">Clients & partners</h2>
          </div>
          <div className="reveal reveal-delay-2">
            <LogoMarquee logos={logos} />
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="hx-cta-wrap">
        <div className="container">
          <div className="hx-cta reveal-scale">
            <div className="hx-cta__rings" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <p className="hx-kicker">Next step</p>
            <h2>Tell us about your business. We’ll show a clear plan.</h2>
            <p className="hx-cta__sub">
              Free call. No hard sell. We’ll explain what to fix first  -  in language that makes sense.
            </p>
            <div className="hx-cta__actions">
              <Link to="/contact" className="btn hx-btn-lg hx-btn-ink">
                Book a free call
                <Icon name="arrow" size={16} color="currentColor" />
              </Link>
              <PreferredSources theme="light" className="preferred-sources--home" />
            </div>
          </div>
        </div>
      </section>

      <GoogleReviews />
      <AwardsCertsHome />
    </div>
  );
}
