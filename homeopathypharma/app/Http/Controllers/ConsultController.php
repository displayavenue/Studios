<?php

namespace App\Http\Controllers;

use App\Models\ContentPage;
use App\Services\SiteSettings;
use Illuminate\View\View;

class ConsultController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $page = ContentPage::query()->published()->where('slug', 'consult')->first();

        return view('pages.consult', [
            'settings' => $settings,
            'page' => $page,
        ]);
    }
}
