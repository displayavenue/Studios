<?php

namespace App\Services\Payments;

use App\Models\Payment;

interface PaymentGateway
{
    public function name(): string;

    public function isConfigured(): bool;

    /**
     * @param  array{receipt: string, description?: string, notes?: array<string, mixed>}  $context
     * @return array{provider_order_id: string, meta?: array<string, mixed>}
     */
    public function createPaymentSession(Payment $payment, array $context = []): array;

    public function verifyCheckoutSignature(array $payload): bool;

    public function verifyWebhookSignature(string $payload, ?string $signature): bool;
}
