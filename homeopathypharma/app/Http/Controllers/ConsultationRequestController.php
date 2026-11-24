<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\DoctorProfile;
use App\Services\ConsultationPaymentService;
use App\Services\Notifications\NotificationService;
use App\Services\Payments\PaymentGatewayManager;
use App\Services\Payments\RazorpayGateway;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;
use RuntimeException;

class ConsultationRequestController extends Controller
{
    public function create(string $slug, SiteSettings $settings): View
    {
        $doctor = DoctorProfile::query()->publiclyListed()->where('slug', $slug)->firstOrFail();

        return view('pages.consultation-request', [
            'settings' => $settings,
            'doctor' => $doctor,
            'feeDisplay' => '₹'.number_format(($doctor->fee_paise ?? $settings->consultationFeePaise()) / 100, 0),
        ]);
    }

    public function store(Request $request, string $slug, SiteSettings $settings, NotificationService $notifications): RedirectResponse
    {
        $doctor = DoctorProfile::query()->publiclyListed()->where('slug', $slug)->firstOrFail();

        $data = $request->validate([
            'patient_name' => ['required', 'string', 'max:120'],
            'patient_phone' => ['required', 'string', 'max:30'],
            'patient_email' => ['nullable', 'email', 'max:190'],
            'concern' => ['nullable', 'string', 'max:2000'],
            'preferred_window' => ['nullable', 'string', 'max:190'],
            'terms' => ['accepted'],
        ]);

        $fee = $doctor->fee_paise ?? $settings->consultationFeePaise();

        $record = ConsultationRequest::query()->create([
            'number' => 'CR-'.strtoupper(Str::random(8)),
            'doctor_profile_id' => $doctor->id,
            'user_id' => $request->user()?->id,
            'patient_name' => $data['patient_name'],
            'patient_phone' => $data['patient_phone'],
            'patient_email' => $data['patient_email'] ?? null,
            'concern' => $data['concern'] ?? null,
            'preferred_window' => $data['preferred_window'] ?? null,
            'fee_paise' => $fee,
            'payment_status' => 'unpaid',
            'status' => 'pending',
        ]);

        $notifications->notify(
            'consultation.requested',
            null,
            'Consultation request '.$record->number.' for '.$doctor->full_name,
            ['phone' => $data['patient_phone']]
        );

        return redirect()
            ->route('consultations.pay', $record)
            ->with('status', 'Request received. Pay the consultation fee to confirm your booking.');
    }

    public function pay(
        ConsultationRequest $consultation,
        SiteSettings $settings,
        PaymentGatewayManager $payments,
        ConsultationPaymentService $paymentService,
    ): View|RedirectResponse {
        $consultation->load('doctor');

        if ($consultation->isPaid()) {
            return redirect()->route('consultations.confirmation', $consultation);
        }

        $gateway = $payments->gatewayOrNull();
        if (! $gateway) {
            return view('pages.consultation-pay', [
                'settings' => $settings,
                'consultation' => $consultation,
                'gateway' => null,
                'payment' => null,
                'session' => [],
                'offline' => true,
            ]);
        }

        try {
            $result = $paymentService->startPayment($consultation);
        } catch (RuntimeException $e) {
            return view('pages.consultation-pay', [
                'settings' => $settings,
                'consultation' => $consultation,
                'gateway' => null,
                'payment' => null,
                'session' => [],
                'offline' => true,
                'error' => $e->getMessage(),
            ]);
        }

        return view('pages.consultation-pay', [
            'settings' => $settings,
            'consultation' => $result['consultation']->load('doctor'),
            'gateway' => $result['gateway'],
            'payment' => $result['payment'],
            'session' => $result['session'],
            'offline' => false,
        ]);
    }

    public function success(
        Request $request,
        ConsultationRequest $consultation,
        ConsultationPaymentService $paymentService,
        PaymentGatewayManager $payments,
    ): View|RedirectResponse {
        $payload = $request->validate([
            'razorpay_order_id' => ['nullable', 'string'],
            'razorpay_payment_id' => ['nullable', 'string'],
            'razorpay_signature' => ['nullable', 'string'],
            'provider_payment_id' => ['nullable', 'string'],
        ]);

        $consultation->load(['doctor', 'payment']);
        $payment = $consultation->payment;
        $gateway = $payments->gateway();
        $verified = $gateway->verifyCheckoutSignature($payload);

        if ($verified && $payment) {
            $providerPaymentId = $payload['razorpay_payment_id']
                ?? $payload['provider_payment_id']
                ?? 'unknown';
            $paymentService->markPaid($consultation, $payment, $providerPaymentId);
            $consultation->refresh();
        }

        if ($consultation->isPaid()) {
            return redirect()
                ->route('consultations.confirmation', $consultation)
                ->with('status', 'Payment received. Our team will schedule your Google Meet session with the doctor.');
        }

        return view('pages.consultation-pay-failed', [
            'settings' => app(SiteSettings::class),
            'consultation' => $consultation,
            'verified' => $verified,
        ]);
    }

    public function failed(ConsultationRequest $consultation, SiteSettings $settings): View
    {
        return view('pages.consultation-pay-failed', [
            'settings' => $settings,
            'consultation' => $consultation->load('doctor'),
            'verified' => false,
        ]);
    }

    public function confirmTest(
        Request $request,
        ConsultationRequest $consultation,
        ConsultationPaymentService $paymentService,
    ): RedirectResponse {
        if (app()->environment('production')) {
            abort(403, 'Test confirm is disabled in production.');
        }

        if (app(RazorpayGateway::class)->isConfigured()) {
            abort(403, 'Test confirm is disabled when Razorpay is configured.');
        }

        $consultation->load('payment');
        abort_unless($consultation->payment?->provider === 'test', 403);

        $providerPaymentId = 'test_paid_cr_'.$consultation->id;
        $paymentService->markPaid($consultation, $consultation->payment, $providerPaymentId);

        return redirect()->route('consultations.success', [
            'consultation' => $consultation,
            'provider_payment_id' => $providerPaymentId,
        ]);
    }

    public function confirmation(ConsultationRequest $consultation, SiteSettings $settings): View
    {
        $consultation->load('doctor');

        return view('pages.consultation-confirmation', [
            'settings' => $settings,
            'consultation' => $consultation,
        ]);
    }
}
