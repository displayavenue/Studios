import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Header.css";

const serviceCategories = [
  { key: "Wedding", label: "Weddings", anchor: "wedding" },
  { key: "Corporate", label: "Corporate & brands", anchor: "corporate" },
  { key: "Product", label: "Product & e‑commerce", anchor: "product" },
  { key: "Events", label: "Events", anchor: "events" },
  { key: "Aerial", label: "Drone & aerial", anchor: "aerial" },
  { key: "Post", label: "Content & post", anchor: "post" },
] as const;

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80";

type OpenMenu = "services" | "packages" | "more" | null;

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
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const servicesId = useId();
  const packagesId = useId();
  const moreId = useId();

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
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
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

      {typeof document !== "undefined" &&
        createPortal(
          <div className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
            <div className="mobile-drawer__inner">
              <p className="mobile-drawer__label">Menu</p>

              <nav className="mobile-drawer__links mobile-drawer__links--primary" aria-label="Mobile primary">
                <NavLink to="/services" onClick={close}>
                  Services
                </NavLink>
                <NavLink to="/portfolio" onClick={close}>
                  Portfolio
                </NavLink>
                <NavLink to="/packages" onClick={close}>
                  Packages
                </NavLink>
                <NavLink to="/book-now" onClick={close}>
                  Book Now
                </NavLink>
                <NavLink to="/contact" onClick={close}>
                  Contact
                </NavLink>
              </nav>

              <div className="mobile-acc">
                <button
                  type="button"
                  className={`mobile-acc__btn ${mobileSection === "services" ? "is-open" : ""}`}
                  onClick={() =>
                    setMobileSection((s) => (s === "services" ? null : "services"))
                  }
                >
                  Browse services
                </button>
                {mobileSection === "services" && (
                  <div className="mobile-acc__body">
                    {serviceCategories.map(({ key, label, anchor }) => (
                      <div key={key} className="mobile-acc__group">
                        <Link to={`/services#${anchor}`} onClick={close} className="mobile-acc__group-title">
                          {label}
                        </Link>
                        {services
                          .filter((s) => s.category === key)
                          .slice(0, 3)
                          .map((s) => (
                            <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                              {s.title}
                            </Link>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <nav className="mobile-drawer__links" aria-label="Mobile secondary">
                <NavLink to="/about" onClick={close}>
                  About
                </NavLink>
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

              <div className="mobile-drawer__actions">
                <a
                  href={company.whatsappHref}
                  className="btn btn--dark"
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                >
                  WhatsApp us
                </a>
                <a href={company.phoneHref} className="mobile-drawer__phone">
                  {company.phone}
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
