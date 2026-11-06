<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\ContentPage;
use App\Models\HomepageSection;
use App\Services\LeadAlertService;
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
            'page' => ContentPage::query()->published()->where('slug', 'contact')->first(),
        ]);
    }

    public function store(Request $request, SiteSettings $settings, LeadAlertService $alerts): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:190'],
            'email' => ['nullable', 'email', 'max:190'],
            'concern' => ['nullable', 'string', 'max:120'],
            'side_effects' => ['nullable', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
            'consent' => ['accepted'],
            'context' => ['nullable', 'string', 'max:80'],
            'lead_form' => ['nullable', 'string', 'in:doctor,consult_banner,contact'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf'],
        ]);

        $parts = [];
        if (! empty($data['email'])) {
            $parts[] = 'Email: '.$data['email'];
        }
        if (! empty($data['concern'])) {
            $parts[] = 'Concern: '.$data['concern'];
        }
        if (! empty($data['side_effects'])) {
            $parts[] = 'Side effects: '.$data['side_effects'];
        }
        $parts[] = $data['message'];
        if ($request->hasFile('attachment')) {
            $stored = $request->file('attachment')->store('consult-attachments', 'public');
            $parts[] = 'Attachment: '.$stored;
        }
        $message = implode("\n", $parts);
        if (! empty($data['context'])) {
            $message = '['.$data['context'].'] '.$message;
        }

        $source = $data['lead_form'] ?? 'contact';

        $lead = ContactMessage::query()->create([
            'name' => $data['name'],
            'contact' => $data['contact'],
            'message' => $message,
            'consent' => true,
            'status' => 'new',
            'source' => $source,
            'ip_address' => $request->ip(),
        ]);

        $alert = $alerts->alert($lead);

        $success = $this->successMessageFor($source, $settings);
        $anchor = match ($source) {
            'doctor' => '#talk-to-doctor',
            'consult_banner' => '#consult-doctors',
            default => '',
        };
        $previous = preg_replace('/#.*$/', '', (string) url()->previous()) ?: url('/');

        return redirect()
            ->to($previous.$anchor)
            ->with('lead_form', $source)
            ->with('lead_success', true)
            ->with('status', $success)
            ->with('lead_alert', $alert['message']);
    }

    private function successMessageFor(string $source, SiteSettings $settings): string
    {
        if ($source === 'doctor') {
            $section = HomepageSection::query()->where('key', 'doctor_lead')->first();
            $payload = $section?->data() ?? [];
            $custom = trim((string) ($payload['success_message'] ?? ''));
            if ($custom !== '') {
                return $custom;
            }

            return 'Thank you. Our team will connect with you soon.';
        }

        if ($source === 'consult_banner') {
            $section = HomepageSection::query()->where('key', 'consult')->first();
            $payload = $section?->data() ?? [];
            $custom = trim((string) ($payload['success_message'] ?? ''));
            if ($custom !== '') {
                return $custom;
            }
        }

        return 'Thank you. Our team will connect with you soon. For urgent matters please call '.$settings->phoneDisplay().'.';
    }
}
