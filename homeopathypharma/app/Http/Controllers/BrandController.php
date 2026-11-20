<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Services\SiteSettings;
use Illuminate\View\View;

class BrandController extends Controller
{
    public function index(SiteSettings $settings): View
    {
        $brands = Brand::query()
            ->published()
            ->withCount(['products' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return view('pages.brands', [
            'settings' => $settings,
            'brands' => $brands,
        ]);
    }
}
