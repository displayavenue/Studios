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
            'announcement_enabled' => ['sometimes', 'boolean'],
            'announcement_text' => ['nullable', 'string', 'max:500'],
        ]);

        $map = [
            'brand_name' => 'string',
            'tagline' => 'string',
            'phone_display' => 'string',
            'phone_tel' => 'string',
            'address' => 'text',
            'currency' => 'string',
            'locale' => 'string',
            'timezone' => 'string',
            'announcement_enabled' => 'boolean',
            'announcement_text' => 'text',
        ];

        foreach ($map as $key => $type) {
            $value = $key === 'announcement_enabled'
                ? ($request->boolean('announcement_enabled') ? '1' : '0')
                : ($data[$key] ?? null);

            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'group' => str_starts_with($key, 'announcement') ? 'homepage' : (str_contains($key, 'phone') || $key === 'address' ? 'contact' : 'brand'),
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }

        SiteSetting::forgetCache();

        return back()->with('status', 'Settings saved.');
    }
}
