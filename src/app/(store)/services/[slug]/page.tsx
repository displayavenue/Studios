import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BirthDetailsForm } from "@/components/site/birth-details-form";
import { PRICING } from "@/config/site";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Service not found" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED", isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  const price = toNumber(product.price) || PRICING.reportPrice;

  return (
    <div className="container-jk py-10">
      <nav className="text-sm text-[var(--jk-muted)]">
        <Link href="/services" className="hover:text-[var(--jk-purple)]">Services</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/services?category=${product.category.slug}`} className="hover:text-[var(--jk-purple)]">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--jk-navy)]/5">
            <span className="font-display text-3xl text-[var(--jk-gold)]">☽</span>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-lg font-semibold text-[var(--jk-navy)]">{formatINR(price)}</p>
          <p className="mt-4 text-[var(--jk-muted)]">{product.shortDescription}</p>
          {product.description && (
            <div className="prose prose-sm mt-6 max-w-none text-[var(--jk-ink-soft)]">
              <p>{product.description}</p>
            </div>
          )}
          {product.deliveryNote && (
            <p className="mt-4 text-sm text-[var(--jk-muted)]">{product.deliveryNote}</p>
          )}
        </div>

        <BirthDetailsForm productSlug={product.slug} productName={product.name} price={price} />
      </div>
    </div>
  );
}
