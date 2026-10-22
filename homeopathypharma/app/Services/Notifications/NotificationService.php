<?php

namespace App\Services\Notifications;

class NotificationService
{
    public function __construct(private Notifier $notifier) {}

    /**
     * @param  array<string, mixed>  $context
     * @return array{status:string,message:string,channel:string}
     */
    public function notify(string $event, ?string $recipient, string $body, array $context = []): array
    {
        $result = $this->notifier->send($event, $recipient, $body, $context);

        return [
            ...$result,
            'channel' => $this->notifier->channel(),
        ];
    }
}
