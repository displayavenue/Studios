<?php

namespace App\Services\Payments;

use RuntimeException;

class PaymentGatewayManager
{
    public function gateway(): PaymentGateway
    {
        $razorpay = app(RazorpayGateway::class);

        if ($razorpay->isConfigured()) {
            return $razorpay;
        }

        if (app()->environment('production')) {
            throw new RuntimeException(
                'No live payment gateway is configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET before taking orders in production.'
            );
        }

        return app(TestPaymentGateway::class);
    }
}
