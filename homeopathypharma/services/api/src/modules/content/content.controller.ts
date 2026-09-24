import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { ContentService } from './content.service.js';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('homepage')
  getHomepage() {
    return this.contentService.getHomepage();
  }

  @Public()
  @Get('pages/:slug')
  getPage(@Param('slug') slug: string) {
    return this.contentService.getPage(slug);
  }

  @Public()
  @Get('blog')
  listBlogPosts() {
    return this.contentService.listBlogPosts();
  }

  @Public()
  @Get('blog/:slug')
  getBlogPost(@Param('slug') slug: string) {
    return this.contentService.getBlogPost(slug);
  }

  @Public()
  @Get('banners')
  listBanners() {
    return this.contentService.listBanners();
  }

  @Roles('admin', 'super-admin', 'catalog-manager')
  @Permissions('content:write')
  @Put('homepage')
  updateHomepage(@Body() body?: unknown) {
    return this.contentService.updateHomepage(body);
  }

  @Roles('admin', 'super-admin', 'catalog-manager')
  @Permissions('content:write')
  @Post('pages')
  createPage(@Body() body?: unknown) {
    return this.contentService.createPage(body);
  }

  @Roles('admin', 'super-admin', 'catalog-manager')
  @Permissions('content:write')
  @Post('blog')
  createBlogPost(@Body() body?: unknown) {
    return this.contentService.createBlogPost(body);
  }
}
