import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await request.json();

  if (!username || username.length < 3 || username.length > 20) {
    return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ error: "Only letters, numbers, and underscores" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  return NextResponse.json({ success: true });
}
