<?php

namespace App\Services\Payments;

use App\Models\Order;
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

    public function createPaymentSession(Order $order, Payment $payment): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Razorpay is not configured.');
        }

        $response = Http::withBasicAuth(
            (string) config('services.razorpay.key'),
            (string) config('services.razorpay.secret')
        )->post('https://api.razorpay.com/v1/orders', [
            'amount' => $order->total_paise,
            'currency' => $order->currency,
            'receipt' => $order->number,
            'notes' => [
                'order_id' => $order->id,
                'order_number' => $order->number,
            ],
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('Unable to create Razorpay order.');
        }

        $data = $response->json();

        return [
            'provider_order_id' => (string) ($data['id'] ?? ''),
            'meta' => [
                'key' => config('services.razorpay.key'),
                'amount' => $order->total_paise,
                'currency' => $order->currency,
                'name' => config('app.name'),
                'description' => 'Order '.$order->number,
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
