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

    public function facebookUrl(): ?string
    {
        $url = $this->get('facebook_url');

        return is_string($url) && trim($url) !== '' ? $url : null;
    }

    public function instagramUrl(): ?string
    {
        $url = $this->get('instagram_url');

        return is_string($url) && trim($url) !== '' ? $url : null;
    }

    public function consultationFeePaise(): int
    {
        return (int) $this->get('consultation_fee_paise', 99900);
    }

    public function consultationFeeDisplay(): string
    {
        return '₹'.number_format($this->consultationFeePaise() / 100, 0);
    }

    public function whatsappNumber(): string
    {
        $raw = (string) $this->get('whatsapp_number', $this->phoneTel());
        $digits = preg_replace('/\D+/', '', $raw) ?: '918169122333';

        return $digits;
    }

    public function whatsappUrl(?string $prefill = null): string
    {
        $url = 'https://wa.me/'.$this->whatsappNumber();
        if ($prefill !== null && trim($prefill) !== '') {
            $url .= '?text='.rawurlencode($prefill);
        }

        return $url;
    }
}
