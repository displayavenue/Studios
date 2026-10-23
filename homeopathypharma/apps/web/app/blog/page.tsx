import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BLOG_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Blog",
  "/blog",
  "Editorial articles on homeopathy, wellness, and pharmacy updates.",
);

export default function BlogIndexPage() {
  return (
    <ContentPage title="Blog" description="Editorial articles and platform updates." path="/blog">
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {BLOG_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/blog/${slug}/`} className="hp-link hp-focus-ring">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
