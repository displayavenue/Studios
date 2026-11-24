<?php

namespace App\Services\Payments;

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

    public function createPaymentSession(Payment $payment, array $context = []): array
    {
        return [
            'provider_order_id' => 'test_order_'.Str::lower(Str::random(12)),
            'meta' => [
                'mode' => 'test',
                'notice' => 'Test payment mode — no real charge.',
                'amount' => $payment->amount_paise,
                'currency' => $payment->currency,
                'receipt' => $context['receipt'] ?? null,
                'description' => $context['description'] ?? null,
            ],
        ];
    }

    public function verifyCheckoutSignature(array $payload): bool
    {
        $razorpayPaymentId = (string) ($payload['razorpay_payment_id'] ?? '');
        $providerPaymentId = (string) ($payload['provider_payment_id'] ?? '');

        return $razorpayPaymentId === 'test_paid'
            || $providerPaymentId === 'test_paid'
            || str_starts_with($providerPaymentId, 'test_paid_');
    }

    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        return $signature === 'test_webhook_secret' || $signature === hash_hmac('sha256', $payload, 'test');
    }
}
