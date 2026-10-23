<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;

interface PaymentGateway
{
    public function name(): string;

    public function isConfigured(): bool;

    /** @return array{provider_order_id:string,meta?:array<string,mixed>} */
    public function createPaymentSession(Order $order, Payment $payment): array;

    public function verifyCheckoutSignature(array $payload): bool;

    public function verifyWebhookSignature(string $payload, ?string $signature): bool;
}
