<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Services\SiteSettings;
use Illuminate\View\View;

class FaqController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $faqs = Faq::query()->published()->ordered()->get();

        $grouped = collect(Faq::CATEGORIES)
            ->mapWithKeys(fn (string $category) => [
                $category => $faqs->where('category', $category)->values(),
            ])
            ->filter(fn ($items) => $items->isNotEmpty());

        return view('pages.faqs', [
            'settings' => $settings,
            'grouped' => $grouped,
        ]);
    }
}
