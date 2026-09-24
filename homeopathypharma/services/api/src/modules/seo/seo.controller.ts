import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { SeoService } from './seo.service.js';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('sitemap.xml')
  getSitemap() {
    return this.seoService.getSitemap();
  }

  @Public()
  @Get('robots.txt')
  getRobots() {
    return this.seoService.getRobots();
  }

  @Public()
  @Get('metadata/*path')
  getMetadata() {
    return this.seoService.getMetadata();
  }

  @Roles('admin')
  @Post('reindex')
  triggerReindex(@Body() body?: unknown) {
    return this.seoService.triggerReindex(body);
  }

}
