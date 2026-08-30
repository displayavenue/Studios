"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  productId,
  size = "default",
  label = "Add to Cart",
}: {
  productId: string;
  size?: "default" | "sm" | "lg";
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <Button
      size={size}
      className="w-full"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
          });
          if (res.ok) {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          }
        });
      }}
    >
      {pending ? "Adding…" : done ? "Added" : label}
    </Button>
  );
}
