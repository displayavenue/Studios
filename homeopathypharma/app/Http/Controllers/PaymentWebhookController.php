<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentEvent;
use App\Services\CheckoutService;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentWebhookController extends Controller
{
    public function __invoke(Request $request, PaymentGatewayManager $payments, CheckoutService $checkout): Response
    {
        $raw = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature') ?? $request->header('X-Payment-Signature');
        $gateway = $payments->gateway();
        $valid = $gateway->verifyWebhookSignature($raw, $signature);

        $payload = json_decode($raw, true) ?: [];
        $eventId = $payload['id'] ?? $payload['event_id'] ?? null;
        $eventType = $payload['event'] ?? $payload['event_type'] ?? 'unknown';

        if ($eventId && PaymentEvent::query()->where('event_id', $eventId)->exists()) {
            return response('duplicate', 200);
        }

        $providerPaymentId = data_get($payload, 'payload.payment.entity.id')
            ?? data_get($payload, 'payment_id');
        $providerOrderId = data_get($payload, 'payload.payment.entity.order_id')
            ?? data_get($payload, 'order_id');

        $payment = null;
        if ($providerOrderId) {
            $payment = Payment::query()->where('provider_order_id', $providerOrderId)->first();
        }

        PaymentEvent::query()->create([
            'payment_id' => $payment?->id,
            'provider' => $gateway->name(),
            'event_id' => $eventId,
            'event_type' => $eventType,
            'payload' => $payload,
            'signature_valid' => $valid,
        ]);

        if (! $valid) {
            return response('invalid signature', 400);
        }

        if ($payment && $providerPaymentId && in_array($eventType, ['payment.captured', 'payment.authorized', 'test.paid'], true)) {
            $checkout->markPaid($payment->order, $payment, (string) $providerPaymentId);
        }

        return response('ok', 200);
    }
}
