<?php

namespace App\Services\Video;

use App\Models\Appointment;

interface VideoMeetingProvider
{
    public function name(): string;

    public function isConfigured(): bool;

    /** @return array{url:?string,token:?string,notice:string} */
    public function createMeeting(Appointment $appointment): array;
}
