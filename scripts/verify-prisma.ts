import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log("✅ Connected. Users in database:", userCount);

    const gameCount = await prisma.game.count();
    console.log("   Games in database:", gameCount);
  } catch (e: unknown) {
    console.error("❌ Query failed:", (e as Error).constructor.name, (e as Error).message?.slice(0, 300));
  } finally {
    await prisma.$disconnect();
  }
}

main();
