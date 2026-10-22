<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\View\View;

class ShopController extends Controller
{
    public function index(SiteSettings $settings): View
    {
        return view('pages.shop', [
            'settings' => $settings,
            'products' => collect(), // Phase 2: load published products from DB
        ]);
    }
}
