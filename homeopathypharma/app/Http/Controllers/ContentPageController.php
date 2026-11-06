<?php

namespace App\Http\Controllers;

use App\Models\ContentPage;
use App\Models\TeamMember;
use App\Services\SiteSettings;
use Illuminate\View\View;

class ContentPageController extends Controller
{
    public function about(SiteSettings $settings): View
    {
        return view('pages.about', [
            'settings' => $settings,
            'page' => $this->published('about'),
        ]);
    }

    public function consult(SiteSettings $settings): View
    {
        return view('pages.consult', [
            'settings' => $settings,
            'page' => $this->published('consult'),
        ]);
    }

    public function founders(SiteSettings $settings): View
    {
        $members = TeamMember::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->with('photo')
            ->get();

        return view('pages.founders', [
            'settings' => $settings,
            'page' => $this->published('founders'),
            'members' => $members,
        ]);
    }

    private function published(string $slug): ?ContentPage
    {
        return ContentPage::query()
            ->published()
            ->where('slug', $slug)
            ->first();
    }
}
