<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\IdempotencyKey;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private CartService $carts,
        private PaymentGatewayManager $payments,
    ) {}

    /**
     * @param  array<string, mixed>  $customer
     * @return array{order: Order, payment: Payment, gateway: string, session: array<string, mixed>}
     */
    public function placeOrder(Cart $cart, array $customer, string $idempotencyKey): array
    {
        $existing = IdempotencyKey::query()
            ->where('key', $idempotencyKey)
            ->where('scope', 'checkout')
            ->first();

        if ($existing?->order) {
            $payment = $existing->order->payment;

            return [
                'order' => $existing->order->load('items'),
                'payment' => $payment,
                'gateway' => $payment?->provider ?? 'test',
                'session' => $payment?->meta ?? [],
            ];
        }

        $cart->load(['items.product']);

        if ($cart->items->isEmpty()) {
            throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
        }

        return DB::transaction(function () use ($cart, $customer, $idempotencyKey) {
            $lines = [];
            $subtotal = 0;

            foreach ($cart->items as $item) {
                /** @var Product $product */
                $product = Product::query()->lockForUpdate()->find($item->product_id);
                if (! $product || ! $product->isPurchasable() || $item->quantity > $product->stock_qty) {
                    throw ValidationException::withMessages([
                        'cart' => ($product?->name ?? 'A product').' is no longer available in the requested quantity.',
                    ]);
                }

                $unit = $product->currentPricePaise();
                $lineTotal = $unit * (int) $item->quantity;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product' => $product,
                    'quantity' => (int) $item->quantity,
                    'unit' => $unit,
                    'line_total' => $lineTotal,
                ];
            }

            $shipping = 0; // Manual/provider shipping later
            $tax = 0;
            $total = $subtotal + $shipping + $tax;

            $order = Order::query()->create([
                'number' => 'HP'.now()->format('ymd').Str::upper(Str::random(6)),
                'user_id' => $cart->user_id,
                'customer_name' => $customer['customer_name'],
                'customer_phone' => $customer['customer_phone'],
                'customer_email' => $customer['customer_email'] ?? null,
                'shipping_line1' => $customer['shipping_line1'],
                'shipping_line2' => $customer['shipping_line2'] ?? null,
                'shipping_city' => $customer['shipping_city'],
                'shipping_state' => $customer['shipping_state'],
                'shipping_postal_code' => $customer['shipping_postal_code'],
                'shipping_country' => $customer['shipping_country'] ?? 'IN',
                'notes' => $customer['notes'] ?? null,
                'currency' => 'INR',
                'subtotal_paise' => $subtotal,
                'shipping_paise' => $shipping,
                'tax_paise' => $tax,
                'total_paise' => $total,
                'payment_status' => 'pending',
                'fulfilment_status' => 'unfulfilled',
                'idempotency_key' => $idempotencyKey,
            ]);

            foreach ($lines as $line) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'sku' => $line['product']->sku,
                    'unit_price_paise' => $line['unit'],
                    'quantity' => $line['quantity'],
                    'line_total_paise' => $line['line_total'],
                ]);

                $product = $line['product'];
                $product->stock_qty -= $line['quantity'];
                if ($product->stock_qty <= 0) {
                    $product->stock_qty = 0;
                    $product->stock_status = 'out_of_stock';
                }
                $product->save();

                StockMovement::query()->create([
                    'product_id' => $product->id,
                    'order_id' => $order->id,
                    'delta' => -$line['quantity'],
                    'quantity_after' => $product->stock_qty,
                    'reason' => 'order_reserve',
                    'created_by' => $cart->user_id,
                ]);
            }

            $gateway = $this->payments->gateway();
            $payment = Payment::query()->create([
                'order_id' => $order->id,
                'provider' => $gateway->name(),
                'amount_paise' => $order->total_paise,
                'currency' => $order->currency,
                'status' => 'created',
            ]);

            $session = $gateway->createPaymentSession($order, $payment);
            $payment->update([
                'provider_order_id' => $session['provider_order_id'],
                'status' => 'pending',
                'meta' => $session['meta'] ?? [],
            ]);

            IdempotencyKey::query()->create([
                'key' => $idempotencyKey,
                'scope' => 'checkout',
                'order_id' => $order->id,
                'response' => ['order_id' => $order->id],
            ]);

            $this->carts->clear($cart);

            return [
                'order' => $order->load('items'),
                'payment' => $payment->fresh(),
                'gateway' => $gateway->name(),
                'session' => $session['meta'] ?? [],
            ];
        });
    }

    public function markPaid(Order $order, Payment $payment, string $providerPaymentId): void
    {
        if ($order->payment_status === 'paid') {
            return;
        }

        DB::transaction(function () use ($order, $payment, $providerPaymentId) {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);
            if ($order->payment_status === 'paid') {
                return;
            }

            $payment->update([
                'provider_payment_id' => $providerPaymentId,
                'status' => 'paid',
            ]);

            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'fulfilment_status' => $order->fulfilment_status === 'unfulfilled' ? 'processing' : $order->fulfilment_status,
            ]);

            foreach ($order->items as $item) {
                StockMovement::query()->create([
                    'product_id' => $item->product_id,
                    'order_id' => $order->id,
                    'delta' => 0,
                    'quantity_after' => Product::query()->find($item->product_id)?->stock_qty ?? 0,
                    'reason' => 'order_paid',
                    'created_by' => $order->user_id,
                ]);
            }
        });
    }
}
