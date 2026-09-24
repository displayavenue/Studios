import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema, ArticleSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

function escapeText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Render CMS body: trust HTML when present, else wrap plain paragraphs. */
function toArticleHtml(content: string | undefined): string {
  const raw = (content || "").trim();
  if (!raw) {
    return "<p>This article is being updated. Check back soon, or book a consultation for tailored advice.</p>";
  }
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return raw
    .split(/\n\n+/)
    .map((block) => `<p>${escapeText(block).replaceAll("\n", "<br/>")}</p>`)
    .join("\n");
}

export function Blog() {
  const ref = useReveal<HTMLDivElement>();
  const { blogs, company } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title={`Blog | Wedding Photography & Film Guides | ${company.name}`}
        description={`Expert guides on wedding photography, cinematic films, pre-wedding shoots and booking tips from ${company.name} — Mumbai & pan-India.`}
        path="/blog"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </nav>
          <p className="eyebrow">Blog</p>
          <h1>Wedding photography & film guides for Indian couples</h1>
          <p>
            High-intent planning guides — updated from the CMS and auto-published
            daily for clearer booking decisions.
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

      <TestimonialsSection compact limit={3} />

      <CTABanner />
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const { blogs, company } = useCms();
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

  const seoTitle = post.seoTitle || `${post.title} | ${company.name} Blog`;
  const seoDesc = post.seoDescription || post.excerpt;
  const bodyHtml = toArticleHtml(post.content);

  return (
    <div ref={ref}>
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={seoDesc}
        image={post.image}
        path={`/blog/${post.slug}`}
        datePublished={post.date}
        category={post.category}
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
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
            <div className="article-cta">
              <Link to="/book-now" className="btn btn--gold">
                Book a Consultation
              </Link>
              <Link to="/pricing" className="btn btn--outline">
                View Packages
              </Link>
            </div>
          </div>
        </section>
      </article>

      <TestimonialsSection compact limit={3} />

      <CTABanner />
    </div>
  );
}
