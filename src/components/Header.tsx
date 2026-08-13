import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { img } from "../data/images";
import "./Header.css";

const serviceCategories = [
  { key: "Wedding", label: "Weddings", anchor: "wedding" },
  { key: "Corporate", label: "Corporate & brands", anchor: "corporate" },
  { key: "Product", label: "Product & e‑commerce", anchor: "product" },
  { key: "Events", label: "Events", anchor: "events" },
  { key: "Aerial", label: "Drone & aerial", anchor: "aerial" },
  { key: "Post", label: "Content & post", anchor: "post" },
] as const;

const FALLBACK_SERVICE_IMAGE = img.indianBrideGroom.replace("w=1200", "w=400");

const siteLanguages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
] as const;

function translationUrl(languageCode: string) {
  if (languageCode === "en") return window.location.href;
  return `https://translate.google.com/translate?sl=auto&tl=${languageCode}&u=${encodeURIComponent(window.location.href)}`;
}

type OpenMenu = "services" | "packages" | "more" | "language" | null;

function NavServiceThumb({ src }: { src: string }) {
  const [img, setImg] = useState(src);
  return (
    <img
      src={img}
      alt=""
      loading="lazy"
      onError={() => setImg(FALLBACK_SERVICE_IMAGE)}
    />
  );
}

export function Header() {
  const { company, services, packageGroups } = useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<OpenMenu>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollLockY = useRef(0);
  const servicesId = useId();
  const packagesId = useId();
  const moreId = useId();
  const languageId = useId();

  const popularServices = [
    "wedding-photography",
    "wedding-videography",
    "corporate-photography",
    "product-photography",
    "drone-photography",
  ]
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    scrollLockY.current = window.scrollY;
    document.body.classList.add("menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollLockY.current);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setMenu(null);
  };

  const toggleMenu = (key: OpenMenu) => {
    setMenu((current) => (current === key ? null : key));
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled || open || menu ? "is-solid" : "is-transparent"} ${open ? "is-menu-open" : ""}`}
      >
        <div className="container site-header__inner">
          <Link to="/" className="logo" onClick={close} aria-label="DisplayAvenue Studios home">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Studios</small>
            </span>
          </Link>

          <nav className="site-nav site-nav--desktop" aria-label="Primary" ref={navRef}>
            <div
              className={`nav-dropdown ${menu === "services" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("services")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${pathname.startsWith("/services") ? "active" : ""}`}
                aria-expanded={menu === "services"}
                aria-controls={servicesId}
                onClick={() => toggleMenu("services")}
              >
                Services
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={servicesId} className="nav-panel nav-panel--mega" role="region" aria-label="Services menu">
                <div className="nav-mega__head">
                  <div className="nav-panel__intro">
                    <p className="eyebrow">What we shoot</p>
                    <strong>Photography, film &amp; post</strong>
                    <p>Weddings, brands, products and events — pan India.</p>
                  </div>
                  <div className="nav-mega__actions">
                    <Link to="/services" className="btn btn--dark btn--sm" onClick={close}>
                      All services
                    </Link>
                    <Link to="/book-now" className="btn btn--outline btn--sm" onClick={close}>
                      Get a quote
                    </Link>
                  </div>
                </div>

                <div className="nav-panel__cols">
                  {serviceCategories.map(({ key, label, anchor }) => {
                    const items = services.filter((s) => s.category === key).slice(0, 2);
                    if (!items.length) return null;
                    return (
                      <div key={key} className="nav-col">
                        <Link to={`/services#${anchor}`} className="nav-col__title" onClick={close}>
                          {label}
                        </Link>
                        {items.map((s) => (
                          <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>

                <div className="nav-mega__popular">
                  <p className="nav-col__title">Popular</p>
                  <div className="nav-featured-grid">
                    {popularServices.map(
                      (s) =>
                        s && (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="nav-featured-card"
                            onClick={close}
                          >
                            <NavServiceThumb src={s.image} />
                            <span>{s.title}</span>
                          </Link>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/portfolio" className="nav-link" onClick={() => setMenu(null)}>
              Portfolio
            </NavLink>

            <div
              className={`nav-dropdown ${menu === "packages" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("packages")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${pathname.startsWith("/packages") || pathname === "/pricing" ? "active" : ""}`}
                aria-expanded={menu === "packages"}
                aria-controls={packagesId}
                onClick={() => toggleMenu("packages")}
              >
                Packages
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={packagesId} className="nav-panel nav-panel--sm" role="region" aria-label="Packages menu">
                <Link to="/packages" onClick={close}>
                  All packages
                </Link>
                {packageGroups.map((g) => (
                  <Link key={g.slug} to={`/packages/${g.slug}`} onClick={close}>
                    {g.title}
                  </Link>
                ))}
                <Link to="/pricing" className="nav-panel__accent" onClick={close}>
                  Pricing guide →
                </Link>
              </div>
            </div>

            <NavLink to="/about" className="nav-link" onClick={() => setMenu(null)}>
              About
            </NavLink>

            <div
              className={`nav-dropdown ${menu === "more" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("more")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${["/industries", "/locations", "/blog", "/faqs", "/pages"].some((p) => pathname.startsWith(p)) ? "active" : ""}`}
                aria-expanded={menu === "more"}
                aria-controls={moreId}
                onClick={() => toggleMenu("more")}
              >
                More
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={moreId} className="nav-panel nav-panel--sm" role="region" aria-label="More pages">
                <Link to="/industries" onClick={close}>
                  Industries
                </Link>
                <Link to="/locations" onClick={close}>
                  Locations
                </Link>
                <Link to="/blog" onClick={close}>
                  Blog
                </Link>
                <Link to="/faqs" onClick={close}>
                  FAQs
                </Link>
                <Link to="/pages" onClick={close}>
                  Site map
                </Link>
              </div>
            </div>

            <div
              className={`nav-dropdown nav-dropdown--language ${menu === "language" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("language")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className="nav-link nav-link--btn language-toggle"
                aria-expanded={menu === "language"}
                aria-controls={languageId}
                onClick={() => toggleMenu("language")}
              >
                English
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={languageId} className="nav-panel nav-panel--language" role="region" aria-label="Choose language">
                <p className="language-menu__title">Choose language</p>
                {siteLanguages.map((language) => (
                  <a
                    key={language.code}
                    href={translationUrl(language.code)}
                    lang={language.code}
                    onClick={() => setMenu(null)}
                  >
                    <span>{language.label}</span>
                    <small>{language.native}</small>
                  </a>
                ))}
              </div>
            </div>

            <NavLink to="/contact" className="nav-link" onClick={() => setMenu(null)}>
              Contact
            </NavLink>
          </nav>

          <div className="site-header__actions">
            <a
              className="header-wa"
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp DisplayAvenue Studios"
            >
              WhatsApp
            </a>
            <Link to="/book-now" className="btn btn--gold header-cta">
              Book Now
            </Link>
            <button
              type="button"
              className={`menu-toggle ${open ? "is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="mobile-drawer is-open" role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="mobile-drawer__bar">
              <p className="mobile-drawer__label">Menu</p>
              <button type="button" className="mobile-drawer__close" onClick={close} aria-label="Close menu">
                Close
              </button>
            </div>

            <div className="mobile-drawer__inner">
              <div className="mobile-drawer__ctas">
                <Link to="/book-now" className="btn btn--gold" onClick={close}>
                  Book Now
                </Link>
                <a
                  href={company.whatsappHref}
                  className="btn btn--outline"
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                >
                  WhatsApp
                </a>
              </div>

              <nav className="mobile-nav" aria-label="Mobile primary">
                <NavLink to="/services" onClick={close}>
                  Services
                </NavLink>
                <NavLink to="/portfolio" onClick={close}>
                  Portfolio
                </NavLink>
                <NavLink to="/packages" onClick={close}>
                  Packages
                </NavLink>
                <NavLink to="/about" onClick={close}>
                  About
                </NavLink>
                <NavLink to="/contact" onClick={close}>
                  Contact
                </NavLink>
              </nav>

              <div className="mobile-nav__section">
                <p className="mobile-nav__heading">Browse by category</p>
                <div className="mobile-chip-grid">
                  {serviceCategories.map(({ label, anchor }) => (
                    <Link key={anchor} to={`/services#${anchor}`} onClick={close}>
                      {label}
                    </Link>
                  ))}
                </div>
                <Link to="/services" className="mobile-nav__all" onClick={close}>
                  View all services →
                </Link>
              </div>

              <nav className="mobile-nav mobile-nav--secondary" aria-label="Mobile secondary">
                <NavLink to="/industries" onClick={close}>
                  Industries
                </NavLink>
                <NavLink to="/locations" onClick={close}>
                  Locations
                </NavLink>
                <NavLink to="/pricing" onClick={close}>
                  Pricing
                </NavLink>
                <NavLink to="/blog" onClick={close}>
                  Blog
                </NavLink>
                <NavLink to="/faqs" onClick={close}>
                  FAQs
                </NavLink>
              </nav>

              <div className="mobile-nav__section mobile-language-menu">
                <p className="mobile-nav__heading">Choose language</p>
                <div className="mobile-language-grid">
                  {siteLanguages.map((language) => (
                    <a key={language.code} href={translationUrl(language.code)} lang={language.code} onClick={close}>
                      <span>{language.label}</span>
                      <small>{language.native}</small>
                    </a>
                  ))}
                </div>
              </div>

              <a href={company.phoneHref} className="mobile-drawer__phone">
                Call {company.phone}
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
