<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\DoctorProfile;
use App\Services\ConsultationPaymentService;
use App\Services\Notifications\NotificationService;
use App\Services\Payments\PaymentGatewayManager;
use App\Services\Payments\RazorpayGateway;
use App\Services\SiteSettings;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
            'concern' => ['required', 'string', 'max:2000'],
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
            'concern' => $data['concern'],
            'preferred_window' => null,
            'fee_paise' => $fee,
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'source' => 'doctor_page',
        ]);

        $notifications->notify(
            'consultation.requested',
            null,
            'Consultation request '.$record->number.' for '.$doctor->full_name,
            ['phone' => $data['patient_phone']]
        );

        return redirect()
            ->route('consultations.schedule', $record)
            ->with('status', 'Choose your preferred day and time, then pay the consultation fee.');
    }

    public function schedule(ConsultationRequest $consultation, SiteSettings $settings): View|RedirectResponse
    {
        $consultation->load('doctor');

        if ($consultation->isPaid()) {
            return redirect()->route('consultations.confirmation', $consultation);
        }

        return view('pages.consultation-schedule', [
            'settings' => $settings,
            'consultation' => $consultation,
            'days' => $this->bookingDays(),
            'timeSlots' => ConsultationRequest::bookingTimeSlots(),
            'feeDisplay' => $consultation->formattedFee(),
        ]);
    }

    public function saveSchedule(Request $request, ConsultationRequest $consultation): RedirectResponse
    {
        if ($consultation->isPaid()) {
            return redirect()->route('consultations.confirmation', $consultation);
        }

        $days = $this->bookingDays();
        $allowedDates = collect($days)->pluck('value')->all();

        $data = $request->validate([
            'preferred_date' => ['required', 'date_format:Y-m-d', Rule::in($allowedDates)],
            'preferred_time' => ['required', 'string', Rule::in(ConsultationRequest::bookingTimeSlots())],
        ]);

        $tz = 'Asia/Kolkata';
        $slot = Carbon::createFromFormat('Y-m-d H:i', $data['preferred_date'].' '.$data['preferred_time'], $tz);
        $label = $slot->format('D, j M Y').' · '.$slot->format('g:i A').' IST';

        $consultation->update([
            'preferred_window' => $label,
        ]);

        return redirect()
            ->route('consultations.pay', $consultation)
            ->with('status', 'Slot saved: '.$label.'. Complete payment to confirm your booking.');
    }

    /**
     * Today through 7 days later (Asia/Kolkata), inclusive.
     *
     * @return list<array{value: string, label: string, weekday: string, day: string, month: string}>
     */
    private function bookingDays(): array
    {
        $tz = 'Asia/Kolkata';
        $start = Carbon::now($tz)->startOfDay();
        $days = [];

        for ($i = 0; $i <= 7; $i++) {
            $day = $start->copy()->addDays($i);
            $days[] = [
                'value' => $day->toDateString(),
                'label' => $day->format('D, j M'),
                'weekday' => $day->format('D'),
                'day' => $day->format('j'),
                'month' => $day->format('M'),
            ];
        }

        return $days;
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

        if (! filled($consultation->preferred_window)) {
            return redirect()->route('consultations.schedule', $consultation);
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
