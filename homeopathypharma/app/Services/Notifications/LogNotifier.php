<?php

namespace App\Services\Notifications;

use App\Models\NotificationLog;

/**
 * Default notifier when mail/SMS providers are not configured.
 * Records intent without claiming external delivery.
 */
class LogNotifier implements Notifier
{
    public function channel(): string
    {
        return 'log';
    }

    public function isConfigured(): bool
    {
        return true;
    }

    public function send(string $event, ?string $recipient, string $body, array $context = []): array
    {
        NotificationLog::query()->create([
            'channel' => $this->channel(),
            'event' => $event,
            'recipient' => $recipient,
            'status' => 'skipped',
            'message' => $body,
            'meta' => [
                ...$context,
                'notice' => 'No external mail/SMS provider configured. Notification logged only.',
            ],
        ]);

        return [
            'status' => 'skipped',
            'message' => 'Notification logged locally; external delivery is not configured.',
        ];
    }
}
