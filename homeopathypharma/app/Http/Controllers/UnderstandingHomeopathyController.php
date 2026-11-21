<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use App\Support\UnderstandingHomeopathyFaqs;
use Illuminate\View\View;

class UnderstandingHomeopathyController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        return view('pages.understanding-homeopathy', [
            'settings' => $settings,
            'faqs' => UnderstandingHomeopathyFaqs::items(),
            'source' => 'Homoeopathy — Science of Gentle Healing (Ministry of AYUSH / CCRH, 2016)',
        ]);
    }
}
