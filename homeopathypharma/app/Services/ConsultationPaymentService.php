<?php

namespace App\Services;

use App\Models\ConsultationRequest;
use App\Models\Payment;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConsultationPaymentService
{
    public function __construct(
        private PaymentGatewayManager $payments,
    ) {}

    /**
     * @return array{consultation: ConsultationRequest, payment: Payment, gateway: string, session: array<string, mixed>}
     */
    public function startPayment(ConsultationRequest $consultation): array
    {
        $gateway = $this->payments->gatewayOrNull();
        if (! $gateway) {
            throw new RuntimeException('Online consultation payments are not enabled.');
        }

        if ($consultation->payment_status === 'paid') {
            $payment = $consultation->payment;

            return [
                'consultation' => $consultation,
                'payment' => $payment,
                'gateway' => $payment?->provider ?? $gateway->name(),
                'session' => $payment?->meta ?? [],
            ];
        }

        return DB::transaction(function () use ($consultation, $gateway) {
            $consultation = ConsultationRequest::query()->lockForUpdate()->findOrFail($consultation->id);

            if ($consultation->payment_status === 'paid') {
                $payment = $consultation->payment;

                return [
                    'consultation' => $consultation,
                    'payment' => $payment,
                    'gateway' => $payment?->provider ?? $gateway->name(),
                    'session' => $payment?->meta ?? [],
                ];
            }

            $payment = $consultation->payment;
            if (! $payment || in_array($payment->status, ['paid', 'failed'], true)) {
                $payment = Payment::query()->create([
                    'order_id' => null,
                    'consultation_request_id' => $consultation->id,
                    'provider' => $gateway->name(),
                    'amount_paise' => $consultation->fee_paise,
                    'currency' => 'INR',
                    'status' => 'created',
                ]);
            }

            $session = $gateway->createPaymentSession($payment, [
                'receipt' => $consultation->number,
                'description' => 'Consultation fee '.$consultation->number,
                'notes' => [
                    'consultation_request_id' => $consultation->id,
                    'consultation_number' => $consultation->number,
                ],
            ]);

            $payment->update([
                'provider' => $gateway->name(),
                'provider_order_id' => $session['provider_order_id'],
                'status' => 'pending',
                'meta' => $session['meta'] ?? [],
            ]);

            $consultation->update(['payment_status' => 'pending']);

            return [
                'consultation' => $consultation->fresh(),
                'payment' => $payment->fresh(),
                'gateway' => $gateway->name(),
                'session' => $session['meta'] ?? [],
            ];
        });
    }

    public function markPaid(ConsultationRequest $consultation, Payment $payment, string $providerPaymentId): void
    {
        if ($consultation->payment_status === 'paid') {
            return;
        }

        DB::transaction(function () use ($consultation, $payment, $providerPaymentId) {
            $consultation = ConsultationRequest::query()->lockForUpdate()->findOrFail($consultation->id);
            if ($consultation->payment_status === 'paid') {
                return;
            }

            $payment->update([
                'provider_payment_id' => $providerPaymentId,
                'status' => 'paid',
            ]);

            $consultation->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);
        });
    }
}
