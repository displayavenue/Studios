import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { ContentService } from './content.service.js';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('pages/:slug')
  getPage() {
    return this.contentService.getPage();
  }

  @Public()
  @Get('blog')
  listBlogPosts() {
    return this.contentService.listBlogPosts();
  }

  @Public()
  @Get('blog/:slug')
  getBlogPost() {
    return this.contentService.getBlogPost();
  }

  @Public()
  @Get('banners')
  listBanners() {
    return this.contentService.listBanners();
  }

  @Roles('admin')
  @Permissions('content:write')
  @Post('pages')
  createPage(@Body() body?: unknown) {
    return this.contentService.createPage(body);
  }

  @Roles('admin')
  @Permissions('content:write')
  @Post('blog')
  createBlogPost(@Body() body?: unknown) {
    return this.contentService.createBlogPost(body);
  }

}
