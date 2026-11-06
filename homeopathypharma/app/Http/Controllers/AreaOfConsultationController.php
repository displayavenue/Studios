<?php

namespace App\Http\Controllers;

use App\Models\DoctorProfile;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AreaOfConsultationController extends Controller
{
    public function __invoke(Request $request, SiteSettings $settings): View
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

        return view('pages.area-of-consultation', [
            'settings' => $settings,
            'doctors' => $doctors,
            'specialization' => $specialization,
            'language' => $language,
            'mode' => $mode,
        ]);
    }
}
