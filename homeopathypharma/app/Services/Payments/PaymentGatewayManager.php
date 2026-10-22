<?php

namespace App\Services\Payments;

class PaymentGatewayManager
{
    public function gateway(): PaymentGateway
    {
        $razorpay = app(RazorpayGateway::class);

        if ($razorpay->isConfigured()) {
            return $razorpay;
        }

        return app(TestPaymentGateway::class);
    }
}
