export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  trending?: boolean;
  readMinutes: number;
  cover?: string;
  body: string[];
};

export type BlogCms = {
  title: string;
  lead: string;
  autoPublish: boolean;
  postsPerDay: number;
  updatedAt?: string;
  posts: BlogPost[];
};

export const fallbackBlog: BlogCms = {
  title: "DisplayAvenue Blog",
  lead: "Practical digital marketing updates for Indian business owners.",
  autoPublish: true,
  postsPerDay: 1,
  posts: [],
};

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
