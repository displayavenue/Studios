<?php

namespace App\Services\Payments;

use RuntimeException;

class PaymentGatewayManager
{
    public function gateway(): PaymentGateway
    {
        $gateway = $this->gatewayOrNull();
        if ($gateway) {
            return $gateway;
        }

        throw new RuntimeException(
            'No live payment gateway is configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET before taking orders in production.'
        );
    }

    public function gatewayOrNull(): ?PaymentGateway
    {
        $razorpay = app(RazorpayGateway::class);

        if ($razorpay->isConfigured()) {
            return $razorpay;
        }

        if (app()->environment('production')) {
            return null;
        }

        return app(TestPaymentGateway::class);
    }

    public function isLiveReady(): bool
    {
        return app(RazorpayGateway::class)->isConfigured();
    }
}
