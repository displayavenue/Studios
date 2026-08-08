import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
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
  getProduct() {
    return this.catalogService.getProduct();
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

  @Roles('admin')
  @Permissions('catalog:write')
  @Post('products')
  createProduct(@Body() body?: unknown) {
    return this.catalogService.createProduct(body);
  }

  @Roles('admin')
  @Permissions('catalog:write')
  @Patch('products/:id')
  updateProduct(@Body() body?: unknown) {
    return this.catalogService.updateProduct(body);
  }

}
