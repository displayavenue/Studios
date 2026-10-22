<?php

namespace App\Http\Controllers;

use App\Models\HomepageSection;
use App\Services\SiteSettings;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $sections = HomepageSection::query()
            ->published()
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key');

        return view('home.index', [
            'settings' => $settings,
            'sections' => $sections,
        ]);
    }
}
