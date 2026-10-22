<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\Payments\PaymentGatewayManager;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CheckoutController extends Controller
{
    public function show(CartService $carts, SiteSettings $settings, PaymentGatewayManager $payments): View|RedirectResponse
    {
        $cart = $carts->current();
        if ($cart->items->isEmpty()) {
            return redirect()->route('cart')->withErrors(['cart' => 'Your cart is empty.']);
        }

        return view('pages.checkout', [
            'settings' => $settings,
            'cart' => $cart,
            'gatewayName' => $payments->gateway()->name(),
            'razorpayConfigured' => app(\App\Services\Payments\RazorpayGateway::class)->isConfigured(),
        ]);
    }

    public function store(Request $request, CartService $carts, CheckoutService $checkout): RedirectResponse|View
    {
        $customer = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:190'],
            'shipping_line1' => ['required', 'string', 'max:190'],
            'shipping_line2' => ['nullable', 'string', 'max:190'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_state' => ['required', 'string', 'max:100'],
            'shipping_postal_code' => ['required', 'string', 'max:20'],
            'shipping_country' => ['nullable', 'string', 'size:2'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'idempotency_key' => ['nullable', 'string', 'max:100'],
        ]);

        $idempotencyKey = $customer['idempotency_key'] ?: (string) Str::uuid();
        unset($customer['idempotency_key']);

        $cart = $carts->current();
        $result = $checkout->placeOrder($cart, $customer, $idempotencyKey);

        return view('pages.checkout-pay', [
            'order' => $result['order'],
            'payment' => $result['payment'],
            'gateway' => $result['gateway'],
            'session' => $result['session'],
        ]);
    }

    public function success(Request $request, CheckoutService $checkout, PaymentGatewayManager $payments): View
    {
        $payload = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'razorpay_order_id' => ['nullable', 'string'],
            'razorpay_payment_id' => ['nullable', 'string'],
            'razorpay_signature' => ['nullable', 'string'],
            'provider_payment_id' => ['nullable', 'string'],
        ]);

        $order = \App\Models\Order::query()->with('payment')->findOrFail($payload['order_id']);
        $payment = $order->payment;

        // Success URL alone never marks paid — signature/provider verification required.
        $gateway = $payments->gateway();
        $verified = $gateway->verifyCheckoutSignature($payload);

        if ($verified && $payment) {
            $providerPaymentId = $payload['razorpay_payment_id']
                ?? $payload['provider_payment_id']
                ?? 'unknown';
            $checkout->markPaid($order, $payment, $providerPaymentId);
            $order->refresh();
        }

        return view('pages.checkout-success', [
            'order' => $order->fresh(['items', 'payment']),
            'verified' => $verified && $order->fresh()->payment_status === 'paid',
        ]);
    }

    public function failed(): View
    {
        return view('pages.checkout-failed');
    }

    /** Test-mode confirm button when Razorpay is not configured. */
    public function confirmTest(Request $request, CheckoutService $checkout): RedirectResponse
    {
        if (app()->environment('production')) {
            abort(403, 'Test confirm is disabled in production.');
        }

        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
        ]);

        if (app(\App\Services\Payments\RazorpayGateway::class)->isConfigured()) {
            abort(403, 'Test confirm is disabled when Razorpay is configured.');
        }

        $order = \App\Models\Order::query()->with('payment')->findOrFail($data['order_id']);
        abort_unless($order->payment?->provider === 'test', 403);

        $checkout->markPaid($order, $order->payment, 'test_paid');

        return redirect()->route('checkout.success', [
            'order_id' => $order->id,
            'provider_payment_id' => 'test_paid',
        ]);
    }
}
