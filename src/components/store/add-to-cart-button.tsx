"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  size = "default",
  label = "Add to Cart",
  className,
}: {
  productId: string;
  size?: "default" | "sm" | "lg";
  label?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <Button
      size={size}
      className={cn("w-full", className)}
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
