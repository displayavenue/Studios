<?php

namespace App\Http\Controllers;

use App\Models\DoctorProfile;
use App\Services\AppointmentBookingService;
use App\Services\SiteSettings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DoctorController extends Controller
{
    public function index(Request $request, SiteSettings $settings): View
    {
        $specialization = trim((string) $request->query('specialization', ''));
        $language = trim((string) $request->query('language', ''));
        $mode = trim((string) $request->query('mode', ''));

        $doctors = DoctorProfile::query()
            ->publiclyListed()
            ->with('photo')
            ->when($specialization !== '', function ($q) use ($specialization) {
                $q->whereJsonContains('specializations', $specialization);
            })
            ->when($language !== '', function ($q) use ($language) {
                $q->whereJsonContains('languages', $language);
            })
            ->when($mode !== '', function ($q) use ($mode) {
                $q->whereJsonContains('consultation_modes', $mode);
            })
            ->orderBy('full_name')
            ->paginate(12)
            ->withQueryString();

        return view('pages.doctors', [
            'settings' => $settings,
            'doctors' => $doctors,
            'specialization' => $specialization,
            'language' => $language,
            'mode' => $mode,
        ]);
    }

    public function show(string $slug, Request $request, SiteSettings $settings, AppointmentBookingService $booking): View
    {
        $doctor = DoctorProfile::query()
            ->publiclyListed()
            ->with(['photo', 'credentials' => fn ($q) => $q->where('review_status', 'verified')])
            ->where('slug', $slug)
            ->firstOrFail();

        $date = $request->query('date')
            ? Carbon::parse($request->query('date'), 'Asia/Kolkata')
            : now('Asia/Kolkata');
        $mode = (string) $request->query('mode', ($doctor->consultation_modes[0] ?? 'online'));
        $slots = $booking->availableSlots($doctor, $date, $mode);

        return view('pages.doctor-show', [
            'settings' => $settings,
            'doctor' => $doctor,
            'date' => $date->toDateString(),
            'mode' => $mode,
            'slots' => $slots,
        ]);
    }
}
