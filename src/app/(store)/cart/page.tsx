"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR, toNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CartResponse = {
  cart: {
    items: Array<{
      id: string;
      quantity: number;
      price: string | number;
      product: {
        id: string;
        title: string;
        slug: string;
        primaryImageUrl: string | null;
      };
    }>;
  };
  summary: { subtotal: number; itemCount: number };
};

export default function CartPage() {
  const [data, setData] = useState<CartResponse | null>(null);
  const [pending, startTransition] = useTransition();

  const load = () =>
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setData);

  useEffect(() => {
    load();
  }, []);

  const update = (itemId: string, quantity: number) => {
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      await load();
    });
  };

  const remove = (itemId: string) => {
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, action: "remove" }),
      });
      await load();
    });
  };

  if (!data) {
    return <div className="container-velora py-16 text-sm text-[var(--velora-muted)]">Loading cart…</div>;
  }

  const items = data.cart.items;

  return (
    <div className="container-velora py-10">
      <h1 className="font-display text-4xl">Cart</h1>
      {!items.length ? (
        <div className="mt-10 text-center">
          <p className="text-[var(--velora-muted)]">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block text-[var(--velora-accent)] underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-[var(--velora-line)] pb-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[var(--velora-sand)]/30">
                  {item.product.primaryImageUrl && (
                    <Image
                      src={item.product.primaryImageUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${item.product.slug}`} className="font-medium">
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-sm">{formatINR(toNumber(item.price))}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-xs text-[var(--velora-muted)]" htmlFor={`qty-${item.id}`}>
                      Qty
                    </label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      className="h-9 w-16 rounded border border-[var(--velora-line)] px-2 text-sm"
                      onBlur={(e) => update(item.id, Number(e.target.value))}
                      disabled={pending}
                    />
                    <button
                      className="text-xs text-[var(--velora-muted)] underline"
                      onClick={() => remove(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-[var(--velora-line)] bg-white/60 p-6">
            <h2 className="font-display text-xl">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatINR(data.summary.subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--velora-muted)]">
              Shipping & tax calculated at checkout.
            </p>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
