<?php

namespace App\Services;

use App\Models\SiteSetting;

class SiteSettings
{
    public function get(string $key, mixed $default = null): mixed
    {
        return SiteSetting::getValue($key, $default);
    }

    public function brandName(): string
    {
        return (string) $this->get('brand_name', 'HOMEOPATHY PHARMA');
    }

    public function tagline(): string
    {
        return (string) $this->get('tagline', 'Natural wellness. Expert guidance.');
    }

    public function phoneDisplay(): string
    {
        return (string) $this->get('phone_display', '+91 8169 122333');
    }

    public function phoneTel(): string
    {
        return (string) $this->get('phone_tel', '+918169122333');
    }

    public function address(): string
    {
        return (string) $this->get(
            'address',
            'No. 44, D Wing, Shree Sharanam CHS, Kanakia, Near Fire Station, Unique Garden, Mira Road East, Mumbai – 401107, Maharashtra, India.'
        );
    }

    public function currency(): string
    {
        return (string) $this->get('currency', 'INR');
    }

    public function locale(): string
    {
        return (string) $this->get('locale', 'en-IN');
    }

    public function timezone(): string
    {
        return (string) $this->get('timezone', 'Asia/Kolkata');
    }

    public function announcementEnabled(): bool
    {
        return (bool) $this->get('announcement_enabled', false);
    }

    public function announcementText(): ?string
    {
        $text = $this->get('announcement_text');

        return is_string($text) && trim($text) !== '' ? $text : null;
    }
}
