import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getCart } from "@/lib/api";

export const metadata: Metadata = buildPageMetadata("Your cart", "/cart");

export default async function CartPage() {
  const cart = await getCart();

  return (
    <ContentPage title="Your cart" path="/cart">
      <p style={{ fontSize: "var(--hp-text-lg)" }}>
        {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"} · Subtotal {cart.subtotal}
      </p>
      <p className="product-placeholder">Cart line items load from <code>GET /v1/cart</code>.</p>
    </ContentPage>
  );
}
