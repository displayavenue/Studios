<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\View\View;

class ConsultController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        return view('pages.consult', [
            'settings' => $settings,
        ]);
    }
}
