import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ContentService {
  async getPage(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.getPage is not implemented');
  }

  async listBlogPosts(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.listBlogPosts is not implemented');
  }

  async getBlogPost(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.getBlogPost is not implemented');
  }

  async listBanners(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.listBanners is not implemented');
  }

  async createPage(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.createPage is not implemented');
  }

  async createBlogPost(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ContentService.createBlogPost is not implemented');
  }
}
