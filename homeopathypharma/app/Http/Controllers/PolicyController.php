<?php

namespace App\Http\Controllers;

use App\Models\PolicyPage;
use App\Services\SiteSettings;
use Illuminate\View\View;

class PolicyController extends Controller
{
    public function show(string $slug, SiteSettings $settings): View
    {
        $page = PolicyPage::query()->published()->where('slug', $slug)->firstOrFail();

        return view('pages.policy', compact('settings', 'page'));
    }
}
