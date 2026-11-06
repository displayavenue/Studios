<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\View\View;

class ChatController extends Controller
{
    public function show(SiteSettings $settings): View
    {
        return view('pages.chat', [
            'settings' => $settings,
            'whatsappUrl' => $settings->whatsappUrl(
                'Hi HOMEOPATHY PHARMA, I have a question.'
            ),
        ]);
    }
}
