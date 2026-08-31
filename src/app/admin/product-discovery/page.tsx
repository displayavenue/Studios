import { DiscoveryClient } from "./discovery-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  const suppliers = await prisma.supplier.findMany({ where: { status: "CONNECTED" } });
  return (
    <div>
      <h1 className="font-display text-3xl text-white">Product Discovery</h1>
      <p className="mt-2 text-sm text-[#8fa396]">
        Analyze connected supplier catalogs. Rank by contribution potential — not fabricated demand.
      </p>
      <DiscoveryClient suppliers={suppliers.map((s) => ({ id: s.id, name: s.name, type: s.providerType }))} />
    </div>
  );
}
