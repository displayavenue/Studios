import { Injectable } from '@nestjs/common';
import { getHomepage, saveHomepage, type HomepageContent } from '@homeopathypharma/content-store';

@Injectable()
export class ContentService {
  async getPage(slug?: string) {
    if (slug === 'home' || slug === 'homepage') {
      return { slug: 'home', content: getHomepage() };
    }
    return { slug, content: null, message: 'Page body not found in CMS yet' };
  }

  async listBlogPosts() {
    return { items: [] };
  }

  async getBlogPost(slug?: string) {
    return { slug, content: null };
  }

  async listBanners() {
    return { items: getHomepage().banners };
  }

  async getHomepage() {
    return getHomepage();
  }

  async updateHomepage(body?: unknown) {
    const content = body as HomepageContent;
    return saveHomepage(content);
  }

  async createPage(body?: unknown) {
    return { ok: true, message: 'Use homepage CMS endpoint for landing control', received: body ?? null };
  }

  async createBlogPost(body?: unknown) {
    return { ok: true, received: body ?? null };
  }
}
