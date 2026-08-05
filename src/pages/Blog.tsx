import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { blogs } from "../data/content";
import "./Page.css";

export function Blog() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SEO
        title="Blog | Photography & Film Guides | DisplayAvenue Studios"
        description="Expert guides on wedding photography, product shoots, brand films, drones and booking tips from DisplayAvenue Studios."
        path="/blog"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </nav>
          <p className="eyebrow">Blog</p>
          <h1>Guides built for planning, SEO and better bookings</h1>
          <p>
            Our blog architecture supports 1000+ articles — starting with
            high-intent guides for couples, brands and local search.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container blog-grid">
          {blogs.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card card reveal">
              <div className="blog-card__img">
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="blog-card__body">
                <span>
                  {post.category} · {post.date} · {post.readTime}
                </span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTABanner />
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = blogs.find((b) => b.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!post) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Article not found</h1>
          <Link to="/blog" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref}>
      <SEO
        title={`${post.title} | DisplayAvenue Studios Blog`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
      />

      <article>
        <section className="page-hero">
          <div className="container narrow">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blog</Link>
              <span>/</span>
              <span>{post.category}</span>
            </nav>
            <p className="eyebrow">
              {post.category} · {post.date} · {post.readTime}
            </p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
        </section>

        <section className="section">
          <div className="container narrow reveal">
            <img
              className="article-hero-img"
              src={post.image}
              alt={post.title}
            />
            <div className="article-body">
              <p>
                At DisplayAvenue Studios, we speak with couples, marketing
                teams and venue partners every week. The patterns are clear:
                the best visual outcomes come from early clarity — on style,
                scope, timeline and usage.
              </p>
              <h2>Start with the outcome, not the gear</h2>
              <p>
                Before comparing cameras or package names, define what success
                looks like. For weddings, that may be an heirloom album and a
                cinematic highlight film. For brands, it may be marketplace
                conversion and a launch film that feels premium on every screen.
              </p>
              <h2>Ask for process, not only portfolio</h2>
              <p>
                Beautiful images matter. So does the operating system behind
                them — contracts, shot lists, backup media, delivery portals and
                revision rounds. A luxury studio should feel calm on the day and
                precise after it.
              </p>
              <h2>How DisplayAvenue can help</h2>
              <p>
                Share your date, city and goals. We will recommend a package,
                outline deliverables and reserve your production team with a
                clear booking agreement.
              </p>
              <Link to="/book-now" className="btn btn--gold">
                Book a Consultation
              </Link>
            </div>
          </div>
        </section>
      </article>

      <CTABanner />
    </div>
  );
}
