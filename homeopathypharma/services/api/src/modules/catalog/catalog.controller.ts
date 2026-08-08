import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { CatalogService } from './catalog.service.js';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @Get('products')
  listProducts() {
    return this.catalogService.listProducts();
  }

  @Public()
  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalogService.getProduct(slug);
  }

  @Public()
  @Get('categories')
  listCategories() {
    return this.catalogService.listCategories();
  }

  @Public()
  @Get('brands')
  listBrands() {
    return this.catalogService.listBrands();
  }

  @Roles('admin', 'super-admin', 'catalog-manager')
  @Permissions('catalog:write')
  @Post('products')
  createProduct(@Body() body?: unknown) {
    return this.catalogService.createProduct(body);
  }

  @Roles('admin', 'super-admin', 'catalog-manager')
  @Permissions('catalog:write')
  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() body?: unknown) {
    return this.catalogService.updateProduct(id, body);
  }
}
