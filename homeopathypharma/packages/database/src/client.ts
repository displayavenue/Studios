import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export type { PrismaClient } from "@prisma/client";
export { Prisma } from "@prisma/client";

/** Shared Prisma client for scripts, seeds, and worker bootstrap. */
export function createPrismaClient(datasourceUrl?: string): PrismaClient {
  return new PrismaClient({
    datasources: datasourceUrl
      ? { db: { url: datasourceUrl } }
      : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
