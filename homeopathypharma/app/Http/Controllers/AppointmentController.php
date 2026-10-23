<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Services\AppointmentBookingService;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AppointmentController extends Controller
{
    public function create(string $slug, SiteSettings $settings): View
    {
        $doctor = DoctorProfile::query()->publiclyListed()->where('slug', $slug)->firstOrFail();

        return view('pages.appointment-book', [
            'settings' => $settings,
            'doctor' => $doctor,
            'startsAt' => request('starts_at'),
            'mode' => request('mode', $doctor->consultation_modes[0] ?? 'online'),
        ]);
    }

    public function store(Request $request, string $slug, AppointmentBookingService $booking): RedirectResponse
    {
        $doctor = DoctorProfile::query()->publiclyListed()->where('slug', $slug)->firstOrFail();

        $data = $request->validate([
            'patient_name' => ['required', 'string', 'max:120'],
            'patient_phone' => ['required', 'string', 'max:30'],
            'patient_email' => ['nullable', 'email', 'max:190'],
            'consultation_mode' => ['required', 'in:online,clinic'],
            'starts_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'terms' => ['accepted'],
        ]);

        $appointment = $booking->book($doctor, [
            ...$data,
            'user_id' => $request->user()?->id,
        ]);

        return redirect()
            ->route('appointments.confirmation', $appointment)
            ->with('status', 'Appointment confirmed by the server.');
    }

    public function confirmation(Appointment $appointment, SiteSettings $settings): View
    {
        $appointment->load('doctor');

        // Never expose meeting_access_token in this public view.
        return view('pages.appointment-confirmation', [
            'settings' => $settings,
            'appointment' => $appointment,
            'videoNotice' => $appointment->consultation_mode === 'online' && ! $appointment->meeting_url
                ? 'Online video is not configured yet. Joining details will be shared separately if required.'
                : null,
        ]);
    }
}
