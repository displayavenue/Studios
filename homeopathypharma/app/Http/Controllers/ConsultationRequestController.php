<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\DoctorProfile;
use App\Services\Notifications\NotificationService;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

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
            'status' => 'pending',
        ]);

        $notifications->notify(
            'consultation.requested',
            null,
            'Consultation request '.$record->number.' for '.$doctor->full_name,
            ['phone' => $data['patient_phone']]
        );

        return redirect()
            ->route('consultations.confirmation', $record)
            ->with('status', 'Request received. Our team will schedule your Google Meet session with the doctor.');
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
