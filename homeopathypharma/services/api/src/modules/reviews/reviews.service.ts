import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async createReview(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReviewsService.createReview is not implemented');
  }

  async listReviews(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReviewsService.listReviews is not implemented');
  }

  async getReview(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReviewsService.getReview is not implemented');
  }

  async moderateReview(_payload?: unknown): Promise<Record<string, unknown>> {
    throw new NotImplementedException('ReviewsService.moderateReview is not implemented');
  }
}
