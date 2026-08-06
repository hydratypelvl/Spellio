import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { word, attempts, won, time } = body;

  if (!word || typeof attempts !== "number" || typeof won !== "boolean" || typeof time !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const userId = session.user.id;

  await prisma.game.create({
    data: {
      userId,
      word: word.toUpperCase(),
      attempts,
      won,
      time,
    },
  });

  const stats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (stats) {
    const distribution = stats.guessDistribution as Record<string, number>;
    if (won) {
      distribution[attempts] = (distribution[attempts] || 0) + 1;
    }

    await prisma.userStats.update({
      where: { userId },
      data: {
        totalGames: stats.totalGames + 1,
        wins: won ? stats.wins + 1 : stats.wins,
        currentStreak: won ? stats.currentStreak + 1 : 0,
        maxStreak: won
          ? Math.max(stats.maxStreak, stats.currentStreak + 1)
          : stats.maxStreak,
        guessDistribution: distribution,
        totalTime: stats.totalTime + time,
      },
    });
  } else {
    const distribution: Record<string, number> = {};
    if (won) {
      distribution[attempts] = 1;
    }

    await prisma.userStats.create({
      data: {
        userId,
        totalGames: 1,
        wins: won ? 1 : 0,
        currentStreak: won ? 1 : 0,
        maxStreak: won ? 1 : 0,
        guessDistribution: distribution,
        totalTime: time,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await prisma.userStats.findUnique({
    where: { userId: session.user.id },
  });

  const recentGames = await prisma.game.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    stats: stats || {
      totalGames: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
      totalTime: 0,
    },
    recentGames,
  });
}
