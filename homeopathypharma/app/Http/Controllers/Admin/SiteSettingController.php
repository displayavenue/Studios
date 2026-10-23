<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SiteSettingController extends Controller
{
    public function edit(): View
    {
        $keys = [
            'brand_name',
            'tagline',
            'phone_display',
            'phone_tel',
            'address',
            'currency',
            'locale',
            'timezone',
            'consultation_fee_paise',
            'facebook_url',
            'instagram_url',
            'announcement_enabled',
            'announcement_text',
        ];

        $settings = SiteSetting::query()->whereIn('key', $keys)->get()->keyBy('key');

        return view('admin.settings.edit', compact('settings', 'keys'));
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'brand_name' => ['required', 'string', 'max:190'],
            'tagline' => ['required', 'string', 'max:255'],
            'phone_display' => ['required', 'string', 'max:50'],
            'phone_tel' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:1000'],
            'currency' => ['required', 'string', 'max:10'],
            'locale' => ['required', 'string', 'max:20'],
            'timezone' => ['required', 'string', 'max:64'],
            'consultation_fee_inr' => ['required', 'numeric', 'min:0'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'announcement_enabled' => ['sometimes', 'boolean'],
            'announcement_text' => ['nullable', 'string', 'max:500'],
        ]);

        $map = [
            'brand_name' => ['string', 'brand'],
            'tagline' => ['string', 'brand'],
            'phone_display' => ['string', 'contact'],
            'phone_tel' => ['string', 'contact'],
            'address' => ['text', 'contact'],
            'currency' => ['string', 'commerce'],
            'locale' => ['string', 'commerce'],
            'timezone' => ['string', 'commerce'],
            'facebook_url' => ['string', 'social'],
            'instagram_url' => ['string', 'social'],
            'announcement_text' => ['text', 'homepage'],
        ];

        foreach ($map as $key => [$type, $group]) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'group' => $group,
                    'value' => $data[$key] ?? '',
                    'type' => $type,
                ]
            );
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'consultation_fee_paise'],
            [
                'group' => 'commerce',
                'value' => (string) (int) round(((float) $data['consultation_fee_inr']) * 100),
                'type' => 'string',
            ]
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'announcement_enabled'],
            [
                'group' => 'homepage',
                'value' => $request->boolean('announcement_enabled') ? '1' : '0',
                'type' => 'boolean',
            ]
        );

        SiteSetting::forgetCache();

        return back()->with('status', 'Settings saved.');
    }
}
