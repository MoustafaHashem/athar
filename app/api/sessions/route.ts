import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    const sessions = await prisma.session.findMany({
      orderBy: { order: "asc" },
      include: {
        instructor: true,
        _count: {
          select: {
            questions: true,
            attempts: true,
            feedbacks: true,
          },
        },
      },
    });

    let attemptsMap: Record<number, any> = {};

    if (currentUser?.userId) {
      const userAttempts = await prisma.quizAttempt.findMany({
        where: { userId: currentUser.userId },
      });

      for (const attempt of userAttempts) {
        attemptsMap[attempt.sessionId] = attempt;
      }
    }

    const formattedSessions = sessions.map((session) => {
      const userAttempt = attemptsMap[session.id] || null;
      return {
        id: session.id,
        order: session.order,
        title: session.title,
        phaseName: session.phaseName,
        day: session.day,
        isUnlocked: session.isUnlocked,
        instructor: session.instructor,
        questionCount: session._count.questions,
        attemptsCount: session._count.attempts,
        feedbacksCount: session._count.feedbacks,
        userAttempt: userAttempt
          ? {
              id: userAttempt.id,
              startTime: userAttempt.startTime,
              submitTime: userAttempt.submitTime,
              isSubmitted: Boolean(userAttempt.submitTime),
              correctCount: userAttempt.correctCount,
              baseScore: userAttempt.baseScore,
              speedBonus: userAttempt.speedBonus,
              orderBonus: userAttempt.orderBonus,
              totalPoints: userAttempt.totalPoints,
            }
          : null,
      };
    });

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب البيانات" }, { status: 500 });
  }
}
