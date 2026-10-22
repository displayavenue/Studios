<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\View\View;

class DoctorController extends Controller
{
    public function index(SiteSettings $settings): View
    {
        return view('pages.doctors', [
            'settings' => $settings,
            'doctors' => collect(), // Phase 4: approved practitioners only
        ]);
    }
}
