const COLLECTIONS = [
  {
    id: 'everyday',
    title: 'Everyday glow',
    blurb: 'Thin chains, small hoops, and stackable rings for daily wear.',
    priceFrom: '₹499',
  },
  {
    id: 'occasion',
    title: 'Occasion light',
    blurb: 'Statement pieces that stay bright through dinners and festivals.',
    priceFrom: '₹899',
  },
  {
    id: 'gifts',
    title: 'Gifts that last',
    blurb: 'Anti-tarnish sets made to keep their shine—and their meaning.',
    priceFrom: '₹1,299',
  },
] as const

const WHY = [
  {
    title: 'Anti-tarnish finish',
    body: 'Protective plating designed to resist dulling from air, sweat, and everyday wear.',
  },
  {
    title: 'Made for real days',
    body: 'Lightweight, water-friendly care routines, and pieces you can actually live in.',
  },
  {
    title: 'Honest materials',
    body: 'Clear product details on plating, base metal, and how to keep the shine.',
  },
] as const

export function HomePage() {
  return (
    <div className="site">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Varnikya home">
          Varnikya
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#collections">Shop</a>
          <a href="#why">Why anti-tarnish</a>
          <a href="#care">Care</a>
        </nav>
        <a className="top-cta" href="#collections">
          Shop
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden>
            <img src="/images/hero.jpg" alt="" />
          </div>
          <div className="hero-veil" aria-hidden />
          <div className="hero-copy">
            <p className="brand-mark anim-in">Varnikya</p>
            <h1 className="anim-in delay-1">Jewellery that keeps its shine.</h1>
            <p className="lede anim-in delay-2">
              Anti-tarnish everyday pieces—quiet luxury you can wear without worry.
            </p>
            <div className="hero-actions anim-in delay-3">
              <a className="btn btn-primary" href="#collections">
                Shop the collection
              </a>
              <a className="btn btn-ghost" href="#why">
                Why it lasts
              </a>
            </div>
          </div>
        </section>

        <section className="section collections" id="collections">
          <div className="container">
            <header className="section-head">
              <h2>Shop by mood</h2>
              <p>Start with what you need—then add pieces that stay bright.</p>
            </header>
            <div className="collection-grid">
              {COLLECTIONS.map((c, i) => (
                <a className={`collection-tile anim-rise delay-${i + 1}`} href="#collections" key={c.id}>
                  <span className="collection-kicker">From {c.priceFrom}</span>
                  <h3>{c.title}</h3>
                  <p>{c.blurb}</p>
                  <span className="tile-link">Explore →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section feature-split" id="why">
          <div className="container split">
            <div className="split-media">
              <img src="/images/product.jpg" alt="Varnikya anti-tarnish earrings and bracelet" />
            </div>
            <div className="split-copy">
              <h2>Built to resist tarnish</h2>
              <p>
                Most fashion jewellery dulls fast. Varnikya pieces use an anti-tarnish finish so your
                gold- and silver-tone favourites stay closer to day-one shine—with simple care.
              </p>
              <ul className="why-list">
                {WHY.map((w) => (
                  <li key={w.title}>
                    <strong>{w.title}</strong>
                    <span>{w.body}</span>
                  </li>
                ))}
              </ul>
              <a className="btn btn-primary" href="#collections">
                Browse pieces
              </a>
            </div>
          </div>
        </section>

        <section className="section care" id="care">
          <div className="container narrow">
            <header className="section-head">
              <h2>Care in 30 seconds</h2>
              <p>Anti-tarnish helps—a light routine keeps pieces looking new longer.</p>
            </header>
            <ol className="care-steps">
              <li>
                <strong>Wear, then wipe</strong>
                <span>A soft dry cloth after wear removes oils before they sit.</span>
              </li>
              <li>
                <strong>Store closed</strong>
                <span>Keep pieces in a pouch or box away from open air and perfume sprays.</span>
              </li>
              <li>
                <strong>Skip harsh cleansers</strong>
                <span>No bleach, toothpaste, or abrasive polish—gentle cloth only.</span>
              </li>
            </ol>
          </div>
        </section>

        <section className="section cta-band">
          <div className="container cta-band-inner">
            <h2>Ready when you are</h2>
            <p>Ship-ready anti-tarnish jewellery. Checkout opens soon—browse the collection now.</p>
            <a className="btn btn-primary" href="#collections">
              Shop Varnikya
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong className="logo">Varnikya</strong>
            <p>Anti-tarnish jewellery for everyday shine.</p>
          </div>
          <div className="footer-links">
            <a href="#collections">Shop</a>
            <a href="#why">Why anti-tarnish</a>
            <a href="#care">Care</a>
          </div>
          <p className="footer-note">© {new Date().getFullYear()} Varnikya</p>
        </div>
      </footer>
    </div>
  )
}
