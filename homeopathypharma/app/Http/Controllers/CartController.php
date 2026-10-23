<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CartController extends Controller
{
    public function show(CartService $carts, SiteSettings $settings): View
    {
        $cart = $carts->current();

        return view('pages.cart', [
            'settings' => $settings,
            'cart' => $cart,
        ]);
    }

    public function add(Request $request, Product $product, CartService $carts): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $carts->add($product, (int) ($data['quantity'] ?? 1));

        return redirect()->route('cart')->with('status', 'Added to cart.');
    }

    public function update(Request $request, CartItem $item, CartService $carts): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $cart = $carts->current();
        $carts->updateQuantity($item, (int) $data['quantity'], $cart);

        return back()->with('status', 'Cart updated.');
    }

    public function remove(CartItem $item, CartService $carts): RedirectResponse
    {
        $cart = $carts->current();
        $carts->remove($item, $cart);

        return back()->with('status', 'Item removed.');
    }
}
