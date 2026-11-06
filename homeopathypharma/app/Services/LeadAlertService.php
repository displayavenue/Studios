<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Models\NotificationLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Instantly alert the business when a homepage/contact lead arrives.
 */
class LeadAlertService
{
    public function __construct(private SiteSettings $settings) {}

    /**
     * @return array{status: string, message: string, channels: list<string>}
     */
    public function alert(ContactMessage $lead): array
    {
        $channels = [];
        $email = trim((string) $this->settings->get('lead_notify_email', ''));
        if ($email === '') {
            $email = trim((string) $this->settings->get('notification_email', ''));
        }

        $subject = 'New Talk to a Doctor lead — '.$lead->name;
        $body = implode("\n", [
            'A new lead was submitted on the website.',
            '',
            'Name: '.$lead->name,
            'Mobile / contact: '.$lead->contact,
            'Source: '.($lead->source ?: 'contact'),
            'Message / concern:',
            $lead->message,
            '',
            'Submitted at: '.$lead->created_at?->timezone('Asia/Kolkata')?->format('d M Y, h:i A').' (Asia/Kolkata)',
            'Admin inbox: '.url('/admin/leads/'.$lead->id),
        ]);

        $whatsapp = $this->settings->whatsappUrl(
            "New website lead\nName: {$lead->name}\nContact: {$lead->contact}\n{$lead->message}"
        );

        if ($email !== '') {
            try {
                Mail::raw($body, function ($message) use ($email, $subject) {
                    $message->to($email)->subject($subject);
                });
                $channels[] = 'mail:'.$email;
                NotificationLog::query()->create([
                    'channel' => 'mail',
                    'event' => 'lead.received',
                    'recipient' => $email,
                    'status' => 'sent',
                    'message' => $body,
                    'meta' => ['contact_message_id' => $lead->id, 'whatsapp_url' => $whatsapp],
                ]);
            } catch (\Throwable $e) {
                Log::warning('Lead email failed', ['error' => $e->getMessage(), 'lead' => $lead->id]);
                NotificationLog::query()->create([
                    'channel' => 'mail',
                    'event' => 'lead.received',
                    'recipient' => $email,
                    'status' => 'failed',
                    'message' => $body,
                    'meta' => [
                        'contact_message_id' => $lead->id,
                        'error' => $e->getMessage(),
                        'whatsapp_url' => $whatsapp,
                    ],
                ]);
            }
        }

        NotificationLog::query()->create([
            'channel' => 'admin_inbox',
            'event' => 'lead.received',
            'recipient' => 'admin',
            'status' => 'stored',
            'message' => $body,
            'meta' => [
                'contact_message_id' => $lead->id,
                'whatsapp_url' => $whatsapp,
            ],
        ]);
        $channels[] = 'admin_inbox';

        return [
            'status' => in_array('mail:'.$email, $channels, true) || str_starts_with(implode(',', $channels), 'mail:') ? 'sent' : 'stored',
            'message' => $email !== ''
                ? 'Lead saved and alert emailed to '.$email.'.'
                : 'Lead saved in Admin → Leads. Set lead notify email in Site Settings for instant email alerts.',
            'channels' => $channels,
        ];
    }

    /**
     * Instant alert for homepage Book a Consultation → Admin → Consult requests.
     *
     * @return array{status: string, message: string, channels: list<string>}
     */
    public function alertConsultRequest(\App\Models\ConsultationRequest $request): array
    {
        $channels = [];
        $email = trim((string) $this->settings->get('lead_notify_email', ''));
        if ($email === '') {
            $email = trim((string) $this->settings->get('notification_email', ''));
        }

        $subject = 'New consult request '.$request->number.' — '.$request->patient_name;
        $body = implode("\n", [
            'A new Book a Consultation request was submitted on the homepage.',
            '',
            'Number: '.$request->number,
            'Name: '.$request->patient_name,
            'Phone / WhatsApp: '.$request->patient_phone,
            'Email: '.($request->patient_email ?: '—'),
            'Concern:',
            $request->concern ?: '—',
            '',
            'Submitted at: '.$request->created_at?->timezone('Asia/Kolkata')?->format('d M Y, h:i A').' (Asia/Kolkata)',
            'Admin inbox: '.url('/admin/consultations/'.$request->id),
        ]);

        if ($email !== '') {
            try {
                Mail::raw($body, function ($message) use ($email, $subject) {
                    $message->to($email)->subject($subject);
                });
                $channels[] = 'mail:'.$email;
                NotificationLog::query()->create([
                    'channel' => 'mail',
                    'event' => 'consultation.requested',
                    'recipient' => $email,
                    'status' => 'sent',
                    'message' => $body,
                    'meta' => ['consultation_request_id' => $request->id],
                ]);
            } catch (\Throwable $e) {
                Log::warning('Consult request email failed', ['error' => $e->getMessage(), 'id' => $request->id]);
            }
        }

        NotificationLog::query()->create([
            'channel' => 'admin_inbox',
            'event' => 'consultation.requested',
            'recipient' => 'admin',
            'status' => 'stored',
            'message' => $body,
            'meta' => ['consultation_request_id' => $request->id],
        ]);
        $channels[] = 'admin_inbox';

        return [
            'status' => $email !== '' ? 'sent' : 'stored',
            'message' => 'Consult request saved in Admin → Consult requests.',
            'channels' => $channels,
        ];
    }
}
