<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

/**
 * Development/test payment gateway used when Razorpay credentials are absent.
 * Clearly marked — does not process real money.
 */
class TestPaymentGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'test';
    }

    public function isConfigured(): bool
    {
        return true;
    }

    public function createPaymentSession(Order $order, Payment $payment): array
    {
        return [
            'provider_order_id' => 'test_order_'.Str::lower(Str::random(12)),
            'meta' => [
                'mode' => 'test',
                'notice' => 'Test payment mode — no real charge.',
            ],
        ];
    }

    public function verifyCheckoutSignature(array $payload): bool
    {
        return ($payload['razorpay_payment_id'] ?? null) === 'test_paid'
            || ($payload['provider_payment_id'] ?? null) === 'test_paid';
    }

    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        return $signature === 'test_webhook_secret' || $signature === hash_hmac('sha256', $payload, 'test');
    }
}
