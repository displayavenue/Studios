<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\ContactMessage;
use App\Services\Notifications\NotificationService;
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
        ]);
    }

    public function store(Request $request, SiteSettings $settings, NotificationService $notifications): RedirectResponse
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
            'lead_form' => ['nullable', 'string', 'max:40'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf'],
        ]);

        $source = $data['lead_form'] ?? 'contact';

        if ($source === 'consult_banner') {
            return $this->storeConsultRequest($request, $data, $settings, $notifications);
        }

        $message = $data['message'];
        if (! empty($data['context'])) {
            $message = '['.$data['context'].'] '.$message;
        }

        ContactMessage::query()->create([
            'name' => $data['name'],
            'contact' => $data['contact'],
            'message' => $message,
            'consent' => true,
            'ip_address' => $request->ip(),
        ]);

        $notify = $notifications->notify(
            'contact.received',
            null,
            'Contact form submission from '.$data['name'],
            ['contact' => $data['contact']]
        );

        return back()
            ->with('lead_form', $data['lead_form'] ?? null)
            ->with(
                'status',
                'Thank you. Your message was saved. '.$notify['message'].' For urgent matters please call '.$settings->phoneDisplay().'.'
            );
    }

    /**
     * Homepage “Book a Consultation” → choose slot → pay.
     *
     * @param  array<string, mixed>  $data
     */
    private function storeConsultRequest(
        Request $request,
        array $data,
        SiteSettings $settings,
        NotificationService $notifications,
    ): RedirectResponse {
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
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'source' => 'homepage_banner',
            'admin_notes' => implode("\n", $notes),
        ]);

        $notifications->notify(
            'consultation.requested',
            null,
            'Consultation request '.$record->number.' from homepage banner',
            ['phone' => $data['contact']]
        );

        return redirect()
            ->route('consultations.schedule', $record)
            ->with('status', 'Choose your preferred day and time within the next 7 days, then pay the consultation fee.');
    }
}
