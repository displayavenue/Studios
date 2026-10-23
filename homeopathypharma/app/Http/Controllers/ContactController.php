<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Services\Notifications\NotificationService;
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

    public function store(Request $request, SiteSettings $settings, NotificationService $notifications): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
            'consent' => ['accepted'],
        ]);

        ContactMessage::query()->create([
            'name' => $data['name'],
            'contact' => $data['contact'],
            'message' => $data['message'],
            'consent' => true,
            'ip_address' => $request->ip(),
        ]);

        $notify = $notifications->notify(
            'contact.received',
            null,
            'Contact form submission from '.$data['name'],
            ['contact' => $data['contact']]
        );

        return back()->with(
            'status',
            'Thank you. Your message was saved. '.$notify['message'].' For urgent matters please call '.$settings->phoneDisplay().'.'
        );
    }
}
