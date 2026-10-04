import { Link, Navigate, useParams } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { SEO, ArticleSchema, BreadcrumbSchema } from "../components/SEO";
import "./Page.css";

export function Blog() {
  const { blogs } = useCms();

  return (
    <div>
      <SEO
        title="Property insights | Dahisar, Mira Road & Bhayandar"
        description="Local guides on buying, renting, documents and redevelopment across Mira Road, Dahisar and Bhayandar."
        path="/blog"
      />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Insights</span>
          <h1>Guides for local decisions</h1>
          <p>Practical notes from the ground — not generic city-wide fluff.</p>
        </div>
      </section>
      <section className="section">
        <div className="container blog-grid">
          {blogs.map((b) => (
            <Link key={b.slug} to={`/blog/${b.slug}`} className="blog-card">
              <img src={b.image} alt="" loading="lazy" />
              <div>
                <span>{b.category}</span>
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function BlogPost() {
  const { slug = "" } = useParams();
  const { blogs, company } = useCms();
  const post = blogs.find((b) => b.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div>
      <SEO
        title={`${post.title} | DisplayAvenue Real Estate`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        image={post.image}
        path={`/blog/${post.slug}`}
        datePublished={post.date}
        category={post.category}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <article className="section">
        <div className="container article">
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="article__meta">{post.date}</p>
          <img className="article__hero" src={post.image} alt="" />
          {post.content.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <div className="article__cta">
            <h3>Need a shortlist for your budget?</h3>
            <a className="btn btn--brass" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp DisplayAvenue
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
