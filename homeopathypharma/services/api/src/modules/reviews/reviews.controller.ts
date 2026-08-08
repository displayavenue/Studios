import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ReviewsService } from './reviews.service.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles('customer')
  @Post('')
  createReview(@Body() body?: unknown) {
    return this.reviewsService.createReview(body);
  }

  @Public()
  @Get('')
  listReviews() {
    return this.reviewsService.listReviews();
  }

  @Public()
  @Get(':id')
  getReview() {
    return this.reviewsService.getReview();
  }

  @Roles('admin')
  @Patch(':id/moderate')
  moderateReview(@Body() body?: unknown) {
    return this.reviewsService.moderateReview(body);
  }

}
