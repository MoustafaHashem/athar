import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const sessionId = parseInt(params.sessionId, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "رقم الجلسة غير صحيح" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        instructor: true,
        questions: {
          select: {
            id: true,
            text: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            // Do NOT select correctOption to prevent client-side inspection
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "الجلسة غير موجودة" }, { status: 404 });
    }

    if (!session.isUnlocked && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "هذه الجلسة مغلقة حالياً من قِبَل الإدارة" }, { status: 403 });
    }

    // Check existing attempt
    let attempt = await prisma.quizAttempt.findUnique({
      where: {
        userId_sessionId: {
          userId: currentUser.userId,
          sessionId: sessionId,
        },
      },
    });

    if (attempt && attempt.submitTime) {
      return NextResponse.json({
        error: "لقد قمت بحل كويز هذه المحاضرة سابقاً!",
        isAlreadySubmitted: true,
        attempt,
      }, { status: 400 });
    }

    // If no attempt exists, create one with startTime = now()
    if (!attempt) {
      attempt = await prisma.quizAttempt.create({
        data: {
          userId: currentUser.userId,
          sessionId: sessionId,
          startTime: new Date(),
        },
      });
    }

    return NextResponse.json({
      session: {
        id: session.id,
        order: session.order,
        title: session.title,
        phaseName: session.phaseName,
        instructor: session.instructor,
        questions: session.questions,
      },
      attemptId: attempt.id,
      startTime: attempt.startTime,
    });
  } catch (error) {
    console.error("Start quiz error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء بدء الكويز" }, { status: 500 });
  }
}
