import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const players = await prisma.userStats.findMany({
    select: {
      totalGames: true,
      wins: true,
      currentStreak: true,
      maxStreak: true,
      totalTime: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
    where: {
      totalGames: { gt: 0 },
      user: { username: { not: null } },
    },
    orderBy: { wins: "desc" },
    take: 50,
  });

  const leaderboard = players.map((p) => ({
    userId: p.user.id,
    username: p.user.username,
    name: p.user.name,
    image: p.user.image,
    totalGames: p.totalGames,
    wins: p.wins,
    winRate: p.totalGames > 0 ? Math.round((p.wins / p.totalGames) * 100) : 0,
    currentStreak: p.currentStreak,
    maxStreak: p.maxStreak,
    avgTime: p.wins > 0 ? Math.round(p.totalTime / p.wins) : 0,
  }));

  return NextResponse.json({ leaderboard });
}
