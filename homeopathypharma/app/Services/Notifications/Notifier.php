<?php

namespace App\Services\Notifications;

interface Notifier
{
    public function channel(): string;

    public function isConfigured(): bool;

    /**
     * @param  array<string, mixed>  $context
     * @return array{status:string,message:string}
     */
    public function send(string $event, ?string $recipient, string $body, array $context = []): array;
}
