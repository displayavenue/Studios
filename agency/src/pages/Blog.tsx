import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { fallbackBlog, sortBlogPosts, type BlogCms, type BlogPost } from "../data/blog";
import "../styles/pages.css";
import "./Blog.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export function useBlog(): { blog: BlogCms; loading: boolean } {
  const [blog, setBlog] = useState<BlogCms>(fallbackBlog);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch(`${base}content/blog.json`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data) return;
        setBlog({
          ...fallbackBlog,
          ...data,
          posts: Array.isArray(data.posts) ? data.posts : [],
        });
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { blog, loading };
}

export function Blog() {
  const { blog, loading } = useBlog();
  const posts = sortBlogPosts(blog.posts);
  const trending = posts.filter((p) => p.trending).slice(0, 3);

  return (
    <div className="page-shell blog-page">
      <SEO
        title="Blog | DisplayAvenue Digital Marketing Insights"
        description={blog.lead}
        path="/blog"
      />
      <div className="container">
        <div className="page-frame blog-frame">
          <p className="badge">Blog</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            {blog.title}
          </h1>
          <p className="section-sub">{blog.lead}</p>
          <p className="blog-meta-line">
            Updated for Indian SMEs · Google Ads · Meta · SEO · WhatsApp growth
            {blog.autoPublish ? " · Daily insights auto-publish enabled" : ""}
          </p>

          {trending.length > 0 && (
            <section className="blog-trending">
              <h2>Trending now</h2>
              <div className="blog-grid">
                {trending.map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            </section>
          )}

          <section className="blog-all">
            <h2>All updates</h2>
            {loading && <p className="section-sub">Loading posts…</p>}
            {!loading && posts.length === 0 && (
              <p className="section-sub">Posts coming soon.</p>
            )}
            <div className="blog-list">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          <div className="blog-cta">
            <h2>Want a plan for your business?</h2>
            <p>Free Strategy Maker or WhatsApp us on 9222 122333.</p>
            <div className="blog-cta__actions">
              <a className="btn btn-primary" href="https://displayavenue.com/strategy/">
                Free Strategy Maker
              </a>
              <Link className="btn btn-outline" to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`blog-card ${featured ? "is-featured" : ""}`}>
      <div className="blog-card__meta">
        <span>{post.category}</span>
        <span>{post.publishedAt}</span>
        <span>{post.readMinutes} min</span>
        {post.trending && <span className="blog-card__trend">Trending</span>}
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="link-arrow">Read article →</span>
    </Link>
  );
}
