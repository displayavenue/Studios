<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Product;
use Illuminate\View\View;

class ReportController extends Controller
{
    public function __invoke(): View
    {
        return view('admin.reports.index', [
            'paidRevenuePaise' => (int) Order::query()->where('payment_status', 'paid')->sum('total_paise'),
            'paidOrders' => Order::query()->where('payment_status', 'paid')->count(),
            'pendingOrders' => Order::query()->where('payment_status', 'pending')->count(),
            'upcomingAppointments' => Appointment::query()
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('starts_at', '>=', now())
                ->count(),
            'lowStock' => Product::query()->where('status', 'published')->where('stock_qty', '<=', 5)->count(),
        ]);
    }
}
