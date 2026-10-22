<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\TeamMember;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(): View
    {
        return view('admin.dashboard', [
            'metrics' => [
                'products_published' => Product::query()->where('status', 'published')->count(),
                'products_draft' => Product::query()->where('status', 'draft')->count(),
                'categories' => Category::query()->count(),
                'brands' => Brand::query()->count(),
                'media' => MediaAsset::query()->count(),
                'team_published' => TeamMember::query()->where('status', 'published')->count(),
                'low_stock' => Product::query()
                    ->where('status', 'published')
                    ->where('stock_qty', '<=', 5)
                    ->count(),
            ],
        ]);
    }
}
