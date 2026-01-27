let prismaSingleton = null;

export const getPrisma = async () => {
  if (prismaSingleton) {
    return prismaSingleton;
  }

  const globalForPrisma = globalThis;
  if (globalForPrisma.prisma) {
    prismaSingleton = globalForPrisma.prisma;
    return prismaSingleton;
  }

  const { PrismaClient } = await import("@prisma/client");
  prismaSingleton = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaSingleton;
  }

  return prismaSingleton;
};
