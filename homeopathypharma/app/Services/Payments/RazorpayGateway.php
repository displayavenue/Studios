<?php

namespace App\Services\Payments;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class RazorpayGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'razorpay';
    }

    public function isConfigured(): bool
    {
        return filled(config('services.razorpay.key'))
            && filled(config('services.razorpay.secret'));
    }

    public function createPaymentSession(Payment $payment, array $context = []): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Razorpay is not configured.');
        }

        $receipt = (string) ($context['receipt'] ?? ('pay-'.$payment->id));
        $description = (string) ($context['description'] ?? ('Payment #'.$payment->id));
        $notes = is_array($context['notes'] ?? null) ? $context['notes'] : [];

        $response = Http::withBasicAuth(
            (string) config('services.razorpay.key'),
            (string) config('services.razorpay.secret')
        )->post('https://api.razorpay.com/v1/orders', [
            'amount' => $payment->amount_paise,
            'currency' => $payment->currency,
            'receipt' => $receipt,
            'notes' => $notes,
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('Unable to create Razorpay order.');
        }

        $data = $response->json();

        return [
            'provider_order_id' => (string) ($data['id'] ?? ''),
            'meta' => [
                'key' => config('services.razorpay.key'),
                'amount' => $payment->amount_paise,
                'currency' => $payment->currency,
                'name' => config('app.name'),
                'description' => $description,
                'receipt' => $receipt,
                'notes' => $notes,
            ],
        ];
    }

    public function verifyCheckoutSignature(array $payload): bool
    {
        $orderId = (string) ($payload['razorpay_order_id'] ?? '');
        $paymentId = (string) ($payload['razorpay_payment_id'] ?? '');
        $signature = (string) ($payload['razorpay_signature'] ?? '');
        $secret = (string) config('services.razorpay.secret');

        if ($orderId === '' || $paymentId === '' || $signature === '' || $secret === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $orderId.'|'.$paymentId, $secret);

        return hash_equals($expected, $signature);
    }

    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        $secret = (string) config('services.razorpay.webhook_secret');
        if ($secret === '' || ! $signature) {
            return false;
        }

        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }
}
