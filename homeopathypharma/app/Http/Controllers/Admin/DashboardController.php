<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Order;
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
                'orders_total' => Order::query()->count(),
                'orders_pending' => Order::query()->where('payment_status', 'pending')->count(),
                'orders_paid' => Order::query()->where('payment_status', 'paid')->count(),
                'revenue_paid_paise' => (int) Order::query()->where('payment_status', 'paid')->sum('total_paise'),
            ],
        ]);
    }
}

