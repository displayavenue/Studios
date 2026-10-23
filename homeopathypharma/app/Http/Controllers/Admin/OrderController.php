<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AuditLogger;
use App\Services\Shipping\ShippingManager;
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
        $order->load(['items', 'payments', 'user', 'shipments']);

        return view('admin.orders.show', compact('order'));
    }

    public function update(Request $request, Order $order, ShippingManager $shipping, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'fulfilment_status' => ['required', 'in:unfulfilled,processing,shipped,delivered,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:120'],
            'courier' => ['nullable', 'string', 'max:120'],
        ]);

        // Admins cannot mark payment as paid from this form — only fulfilment.
        $order->update([
            'fulfilment_status' => $data['fulfilment_status'],
        ]);

        $message = 'Fulfilment status updated.';

        if (in_array($data['fulfilment_status'], ['shipped', 'processing'], true) && ! $order->shipments()->exists()) {
            $shipment = $shipping->createForOrder($order);
            if (! empty($data['tracking_number']) || ! empty($data['courier'])) {
                $shipment->update([
                    'tracking_number' => $data['tracking_number'] ?: $shipment->tracking_number,
                    'courier' => $data['courier'] ?: $shipment->courier,
                    'status' => $data['fulfilment_status'] === 'shipped' ? 'in_transit' : $shipment->status,
                ]);
            }
            $message .= ' Shipment record created via '.$shipment->provider.'.';
        } elseif ($order->shipment && (! empty($data['tracking_number']) || ! empty($data['courier']))) {
            $order->shipment->update([
                'tracking_number' => $data['tracking_number'] ?: $order->shipment->tracking_number,
                'courier' => $data['courier'] ?: $order->shipment->courier,
                'status' => $data['fulfilment_status'] === 'shipped' ? 'in_transit' : $order->shipment->status,
            ]);
            $audit->log('shipment.updated', $order->shipment);
            $message .= ' Tracking details saved.';
        }

        $audit->log('order.fulfilment_updated', $order, [
            'fulfilment_status' => $data['fulfilment_status'],
        ]);

        return back()->with('status', $message);
    }
}
