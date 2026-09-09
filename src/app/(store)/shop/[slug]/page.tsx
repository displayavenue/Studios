import { notFound } from "next/navigation";
import Link from "next/link";
import { getMallItem, MALL_ITEMS } from "@/content/astromall";
import { MallBuyBox } from "@/components/marketplace/mall-buy-box";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MALL_ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getMallItem(slug);
  return { title: item?.name || "AstroMall item" };
}

export default async function ShopItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getMallItem(slug);
  if (!item) notFound();

  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <nav className="text-sm text-[var(--jk-muted)]">
          <Link href="/shop" className="hover:text-[var(--jk-ink)]">
            AstroMall
          </Link>
          <span className="mx-2">/</span>
          <span>{item.name}</span>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div
              className="flex h-56 items-center justify-center rounded-3xl text-6xl text-white"
              style={{ background: `linear-gradient(135deg, ${item.accent}, #111827)` }}
            >
              ✦
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--jk-muted)]">{item.description}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {item.includes.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-[var(--at-cream)] px-3 py-2 text-xs text-[var(--jk-muted)]">{item.caution}</p>
          </div>
          <MallBuyBox item={item} />
        </div>
      </div>
    </div>
  );
}
