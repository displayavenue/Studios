<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ContactController extends Controller
{
    public function show(SiteSettings $settings): View
    {
        return view('pages.contact', [
            'settings' => $settings,
        ]);
    }

    public function store(Request $request, SiteSettings $settings): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
            'consent' => ['accepted'],
        ]);

        // Phase 1: no mail provider configured — do not claim email was sent.
        return back()->with(
            'status',
            'Thank you. Your message was validated. Email delivery is not configured yet — for urgent matters please call '.$settings->phoneDisplay().'.'
        );
    }
}
