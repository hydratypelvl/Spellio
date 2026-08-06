import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@spellio.app" },
    update: {},
    create: {
      email: "demo@spellio.app",
      name: "Demo Player",
      stats: {
        create: {
          totalGames: 12,
          wins: 9,
          currentStreak: 3,
          maxStreak: 5,
          guessDistribution: { "1": 0, "2": 1, "3": 4, "4": 3, "5": 1, "6": 0 },
          totalTime: 1440,
        },
      },
      games: {
        create: [
          { word: "REACT", attempts: 3, won: true, time: 120 },
          { word: "BRUSH", attempts: 4, won: true, time: 180 },
          { word: "PIANO", attempts: 6, won: false, time: 300 },
          { word: "CLOUD", attempts: 2, won: true, time: 60 },
          { word: "TIGER", attempts: 5, won: true, time: 240 },
        ],
      },
    },
  });

  console.log("Seeded:", demoUser.name, demoUser.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
