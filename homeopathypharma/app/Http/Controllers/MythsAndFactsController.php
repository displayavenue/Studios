<?php

namespace App\Http\Controllers;

use App\Models\MythVsFact;
use App\Services\SiteSettings;
use Illuminate\View\View;

class MythsAndFactsController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $items = MythVsFact::query()
            ->published()
            ->ordered()
            ->get(['id', 'myth_title', 'fact_title', 'fact_body', 'sort_order']);

        return view('pages.myths-and-facts', [
            'settings' => $settings,
            'items' => $items,
            'total' => $items->count(),
        ]);
    }
}
