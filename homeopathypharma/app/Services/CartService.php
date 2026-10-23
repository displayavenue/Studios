<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CartService
{
    public const COOKIE = 'hp_cart';

    public function current(?User $user = null): Cart
    {
        $user = $user ?? auth()->user();

        if ($user) {
            $cart = Cart::query()->firstOrCreate(
                ['user_id' => $user->id],
                ['currency' => 'INR']
            );

            $this->mergeGuestCart($cart);

            return $cart->load(['items.product.images.media']);
        }

        $token = session(self::COOKIE)
            ?: Cookie::get(self::COOKIE)
            ?: (string) Str::uuid();

        session([self::COOKIE => $token]);
        Cookie::queue(cookie(self::COOKIE, $token, 60 * 24 * 30));

        return Cart::query()->firstOrCreate(
            ['session_token' => $token],
            ['currency' => 'INR']
        )->load(['items.product.images.media']);
    }

    public function add(Product $product, int $quantity = 1, ?User $user = null): Cart
    {
        if (! $product->isPurchasable()) {
            throw ValidationException::withMessages([
                'product' => 'This product is not available for purchase.',
            ]);
        }

        if ($quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1.',
            ]);
        }

        if ($quantity > $product->stock_qty) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock available.',
            ]);
        }

        $cart = $this->current($user);
        $item = $cart->items()->firstOrNew(['product_id' => $product->id]);
        $newQty = ($item->exists ? (int) $item->quantity : 0) + $quantity;

        if ($newQty > $product->stock_qty) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock available.',
            ]);
        }

        $item->quantity = $newQty;
        $item->cart_id = $cart->id;
        $item->save();

        return $cart->fresh(['items.product.images.media']);
    }

    public function updateQuantity(CartItem $item, int $quantity, Cart $cart): Cart
    {
        if ($item->cart_id !== $cart->id) {
            abort(403);
        }

        if ($quantity < 1) {
            $item->delete();

            return $cart->fresh(['items.product.images.media']);
        }

        $product = $item->product;
        if (! $product || $quantity > $product->stock_qty || ! $product->isPurchasable()) {
            throw ValidationException::withMessages([
                'quantity' => 'Requested quantity is not available.',
            ]);
        }

        $item->update(['quantity' => $quantity]);

        return $cart->fresh(['items.product.images.media']);
    }

    public function remove(CartItem $item, Cart $cart): Cart
    {
        if ($item->cart_id !== $cart->id) {
            abort(403);
        }

        $item->delete();

        return $cart->fresh(['items.product.images.media']);
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }

    private function mergeGuestCart(Cart $userCart): void
    {
        $token = session(self::COOKIE) ?: Cookie::get(self::COOKIE);
        if (! $token) {
            return;
        }

        $guest = Cart::query()->where('session_token', $token)->whereNull('user_id')->first();
        if (! $guest || $guest->id === $userCart->id) {
            return;
        }

        foreach ($guest->items as $guestItem) {
            $existing = $userCart->items()->firstOrNew(['product_id' => $guestItem->product_id]);
            $existing->quantity = ($existing->exists ? (int) $existing->quantity : 0) + (int) $guestItem->quantity;
            $existing->cart_id = $userCart->id;
            $existing->save();
        }

        $guest->items()->delete();
        $guest->delete();
        Cookie::queue(Cookie::forget(self::COOKIE));
    }
}
