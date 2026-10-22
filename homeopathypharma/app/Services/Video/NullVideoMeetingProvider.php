<?php

namespace App\Services\Video;

use App\Models\Appointment;

/**
 * Fallback when no video provider credentials are configured.
 */
class NullVideoMeetingProvider implements VideoMeetingProvider
{
    public function name(): string
    {
        return 'none';
    }

    public function isConfigured(): bool
    {
        return false;
    }

    public function createMeeting(Appointment $appointment): array
    {
        return [
            'url' => null,
            'token' => null,
            'notice' => 'Online video is not configured. The clinic will share joining details separately if needed.',
        ];
    }
}
