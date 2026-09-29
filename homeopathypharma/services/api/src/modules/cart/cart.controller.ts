import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CartService } from './cart.service.js';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles('customer')
  @Get('')
  getCart() {
    return this.cartService.getCart();
  }

  @Roles('customer')
  @Post('items')
  addItem(@Body() body?: unknown) {
    return this.cartService.addItem(body);
  }

  @Roles('customer')
  @Patch('items/:itemId')
  updateItem(@Body() body?: unknown) {
    return this.cartService.updateItem(body);
  }

  @Roles('customer')
  @Delete('items/:itemId')
  removeItem(@Body() body?: unknown) {
    return this.cartService.removeItem(body);
  }

  @Roles('customer')
  @Delete('')
  clearCart(@Body() body?: unknown) {
    return this.cartService.clearCart(body);
  }

}
