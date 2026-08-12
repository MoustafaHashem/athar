import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "overall";
    const sessionIdParam = searchParams.get("sessionId");

    if (type === "session") {
      if (!sessionIdParam) {
        return NextResponse.json({ error: "مطلوب تحديد رقم الجلسة" }, { status: 400 });
      }

      const sessionId = parseInt(sessionIdParam, 10);
      if (isNaN(sessionId)) {
        return NextResponse.json({ error: "رقم الجلسة غير صحيح" }, { status: 400 });
      }

      const attempts = await prisma.quizAttempt.findMany({
        where: {
          sessionId: sessionId,
          submitTime: { not: null },
        },
        orderBy: { totalPoints: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      const sessionLeaderboard = attempts.map((attempt, index) => ({
        rank: index + 1,
        attemptId: attempt.id,
        userId: attempt.userId,
        username: attempt.user.username,
        baseScore: attempt.baseScore,
        speedBonus: attempt.speedBonus,
        orderBonus: attempt.orderBonus,
        totalPoints: attempt.totalPoints,
        submitTime: attempt.submitTime,
      }));

      return NextResponse.json({ type: "session", sessionId, leaderboard: sessionLeaderboard });
    }

    // Overall Leaderboard (by totalScore)
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { totalScore: "desc" },
      select: {
        id: true,
        username: true,
        totalScore: true,
        _count: {
          select: {
            attempts: {
              where: { submitTime: { not: null } },
            },
          },
        },
      },
    });

    const overallLeaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      totalScore: user.totalScore,
      attemptsCount: user._count.attempts,
    }));

    return NextResponse.json({ type: "overall", leaderboard: overallLeaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب لوحة الشرف" }, { status: 500 });
  }
}
