import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator.js';
import { WebhooksService } from './webhooks.service.js';

@Public()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('razorpay')
  handleRazorpay(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string | undefined,
  ) {
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(req.body);
    this.webhooksService.assertRazorpaySignature(rawBody, signature);
    return this.webhooksService.handleRazorpayEvent(req.body as Record<string, unknown>);
  }

  @Post('shiprocket')
  handleShiprocket(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-shiprocket-signature') signature: string | undefined,
  ) {
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(req.body);
    this.webhooksService.assertShiprocketSignature(rawBody, signature);
    return this.webhooksService.handleShiprocketEvent(req.body as Record<string, unknown>);
  }
}
