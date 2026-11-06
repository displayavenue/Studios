<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\ContactMessage;
use App\Models\ContentPage;
use App\Models\HomepageSection;
use App\Services\LeadAlertService;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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

        $source = $data['lead_form'] ?? 'contact';

        // Book a Consultation banner → Admin → Consult requests
        if ($source === 'consult_banner') {
            return $this->storeConsultRequest($request, $data, $settings);
        }

        // Talk to a Doctor (+ contact page) → Admin → Leads
        return $this->storeLead($request, $data, $source, $settings, $alerts);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function storeLead(
        Request $request,
        array $data,
        string $source,
        SiteSettings $settings,
        LeadAlertService $alerts
    ): RedirectResponse {
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
        $message = implode("\n", $parts);
        if (! empty($data['context'])) {
            $message = '['.$data['context'].'] '.$message;
        }

        $lead = ContactMessage::query()->create([
            'name' => $data['name'],
            'contact' => $data['contact'],
            'message' => $message,
            'consent' => true,
            'status' => 'new',
            'source' => $source === 'doctor' ? 'doctor' : 'contact',
            'ip_address' => $request->ip(),
        ]);

        $alert = $alerts->alert($lead);
        $success = $this->successMessageFor($source, $settings);
        $anchor = $source === 'doctor' ? '#talk-to-doctor' : '';
        $previous = preg_replace('/#.*$/', '', (string) url()->previous()) ?: url('/');

        return redirect()
            ->to($previous.$anchor)
            ->with('lead_form', $source)
            ->with('lead_success', true)
            ->with('status', $success)
            ->with('lead_alert', $alert['message']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function storeConsultRequest(Request $request, array $data, SiteSettings $settings): RedirectResponse
    {
        $concernParts = [];
        if (! empty($data['concern'])) {
            $concernParts[] = 'Concern: '.$data['concern'];
        }
        if (! empty($data['side_effects'])) {
            $concernParts[] = 'Side effects: '.$data['side_effects'];
        }
        $concernParts[] = $data['message'];

        $notes = ['Source: Homepage Book a Consultation banner'];
        if ($request->hasFile('attachment')) {
            try {
                $stored = $request->file('attachment')->store('consult-attachments', 'public');
                $notes[] = 'Attachment: '.$stored;
            } catch (\Throwable $e) {
                Log::warning('Consult attachment store failed', ['error' => $e->getMessage()]);
                $notes[] = 'Attachment upload failed.';
            }
        }

        $record = ConsultationRequest::query()->create([
            'number' => 'CR-'.strtoupper(Str::random(8)),
            'doctor_profile_id' => null,
            'user_id' => $request->user()?->id,
            'patient_name' => $data['name'],
            'patient_phone' => $data['contact'],
            'patient_email' => $data['email'] ?? null,
            'concern' => implode("\n", $concernParts),
            'preferred_window' => null,
            'fee_paise' => $settings->consultationFeePaise(),
            'status' => 'pending',
            'source' => 'homepage_banner',
            'admin_notes' => implode("\n", $notes),
        ]);

        try {
            $alerts = app(LeadAlertService::class);
            $alerts->alertConsultRequest($record);
        } catch (\Throwable $e) {
            Log::warning('Consult request alert failed', ['error' => $e->getMessage(), 'id' => $record->id]);
        }

        $success = $this->successMessageFor('consult_banner', $settings);
        $previous = preg_replace('/#.*$/', '', (string) url()->previous()) ?: url('/');

        return redirect()
            ->to($previous.'#consult-doctors')
            ->with('lead_form', 'consult_banner')
            ->with('lead_success', true)
            ->with('status', $success);
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

            return 'Thank you. Our team will connect with you soon to schedule your consultation.';
        }

        return 'Thank you. Our team will connect with you soon. For urgent matters please call '.$settings->phoneDisplay().'.';
    }
}
