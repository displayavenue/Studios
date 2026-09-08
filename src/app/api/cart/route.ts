import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import {
  addToCart,
  getOrCreateCart,
  removeCartItem,
  updateCartItem,
  summarizeCart,
} from "@/services/order/service";
import { nanoid } from "nanoid";

async function sessionIds() {
  const session = await getSession();
  const jar = await cookies();
  let guestId = jar.get("velora_guest")?.value;
  if (!guestId && !session) {
    guestId = nanoid();
  }
  return { userId: session?.id, sessionId: guestId };
}

export async function GET() {
  const ids = await sessionIds();
  const jar = await cookies();
  if (ids.sessionId && !jar.get("velora_guest") && !ids.userId) {
    jar.set("velora_guest", ids.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  const cart = await getOrCreateCart(ids);
  const summary = summarizeCart(cart.items);
  return NextResponse.json({ cart, summary });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ids = await sessionIds();
  const jar = await cookies();
  if (ids.sessionId && !jar.get("velora_guest") && !ids.userId) {
    jar.set("velora_guest", ids.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  try {
    const cart = await addToCart({
      ...ids,
      productId: body.productId,
      quantity: body.quantity ?? 1,
      variantId: body.variantId,
    });
    return NextResponse.json({ ok: true, cart, summary: summarizeCart(cart.items) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "ERROR" },
      { status: 400 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (body.action === "remove") {
    await removeCartItem(body.itemId);
  } else {
    await updateCartItem(body.itemId, body.quantity);
  }
  const ids = await sessionIds();
  const cart = await getOrCreateCart(ids);
  return NextResponse.json({ ok: true, cart, summary: summarizeCart(cart.items) });
}
