<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class OrderController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('payment_status', '');

        $orders = Order::query()
            ->when($status !== '', fn ($q) => $q->where('payment_status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.orders.index', compact('orders', 'status'));
    }

    public function show(Order $order): View
    {
        $order->load(['items', 'payments', 'user']);

        return view('admin.orders.show', compact('order'));
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'fulfilment_status' => ['required', 'in:unfulfilled,processing,shipped,delivered,cancelled'],
        ]);

        // Admins cannot mark payment as paid from this form — only fulfilment.
        $order->update([
            'fulfilment_status' => $data['fulfilment_status'],
        ]);

        return back()->with('status', 'Fulfilment status updated.');
    }
}
