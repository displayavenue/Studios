import { Link, useParams } from "react-router-dom";
import { SEO, ArticleSchema, BreadcrumbSchema } from "../components/SEO";
import { sortBlogPosts } from "../data/blog";
import { useBlog } from "./Blog";
import "../styles/pages.css";
import "./Blog.css";

export function BlogPost() {
  const { slug = "" } = useParams();
  const { blog, loading } = useBlog();
  const post = sortBlogPosts(blog.posts).find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="page-shell container">
        <p>Loading…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-shell container">
        <h1>Post not found</h1>
        <Link to="/blog">← Back to blog</Link>
      </div>
    );
  }

  const related = sortBlogPosts(blog.posts)
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="page-shell blog-page">
      <SEO
        title={`${post.title} | DisplayAvenue Blog`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        noindex={false}
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        category={post.category}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <div className="container">
        <article className="page-frame blog-article">
          <p className="badge">{post.category}</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            {post.title}
          </h1>
          <p className="blog-article__meta">
            {post.author} · {post.publishedAt} · {post.readMinutes} min read
            {post.trending ? " · Trending" : ""}
          </p>
          <p className="section-sub">{post.excerpt}</p>

          <div className="blog-article__body">
            {post.body.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>

          <div className="blog-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="blog-cta">
            <h2>Ready to grow?</h2>
            <p>Get a free plan mapped to your city and budget.</p>
            <div className="blog-cta__actions">
              <a className="btn btn-primary" href="https://wa.me/919222122333">
                WhatsApp 9222 122333
              </a>
              <a className="btn btn-outline" href="https://displayavenue.com/strategy/">
                Strategy Maker
              </a>
              <Link className="btn btn-ghost" to="/blog">
                More articles
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <section className="blog-related">
              <h2>Related</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
