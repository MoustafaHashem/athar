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

    const { answers } = await request.json(); // Map of { [questionId: number]: "A" | "B" | "C" | "D" }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "يرجى إرسال جميع إجابات الكويز" }, { status: 400 });
    }

    const submitTime = new Date();

    // Execute atomic calculation and save inside a single Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch existing attempt
      const attempt = await tx.quizAttempt.findUnique({
        where: {
          userId_sessionId: {
            userId: currentUser.userId,
            sessionId: sessionId,
          },
        },
      });

      if (!attempt) {
        throw new Error("لم يتم العثور على محاولة كويز سارية لهذه الجلسة");
      }

      if (attempt.submitTime) {
        throw new Error("تم تسليم هذا الكويز بالفعل من قبل!");
      }

      // 2. Fetch questions with correct answers
      const questions = await tx.question.findMany({
        where: { sessionId: sessionId },
      });

      let correctCount = 0;
      for (const q of questions) {
        const userAnswer = answers[q.id];
        if (userAnswer && userAnswer.toUpperCase() === q.correctOption.toUpperCase()) {
          correctCount++;
        }
      }

      // 3. Base Score
      const baseScore = correctCount * 10;

      // 4. Speed Bonus calculation (up to 15 points)
      const startTime = new Date(attempt.startTime);
      const timeTakenSeconds = Math.max(1, (submitTime.getTime() - startTime.getTime()) / 1000);
      const timeLimitSeconds = Math.max(60, questions.length * 60);

      const speedBonusFraction = Math.max(0, (timeLimitSeconds - timeTakenSeconds) / timeLimitSeconds);
      const speedBonus = Math.round(speedBonusFraction * 15);

      // 5. Order Bonus calculation based on submission order within this session
      const alreadySubmittedCount = await tx.quizAttempt.count({
        where: {
          sessionId: sessionId,
          submitTime: { not: null },
        },
      });

      const submissionOrder = alreadySubmittedCount + 1; // 1-based order
      let orderBonus = 0;
      if (submissionOrder === 1) orderBonus = 10;
      else if (submissionOrder === 2) orderBonus = 7;
      else if (submissionOrder === 3) orderBonus = 5;
      else if (submissionOrder === 4) orderBonus = 3;
      else if (submissionOrder === 5) orderBonus = 1;
      else orderBonus = 0;

      // 6. Total Points
      const totalPoints = baseScore + speedBonus + orderBonus;

      // 7. Update QuizAttempt record
      const updatedAttempt = await tx.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          submitTime: submitTime,
          correctCount: correctCount,
          baseScore: baseScore,
          speedBonus: speedBonus,
          orderBonus: orderBonus,
          totalPoints: totalPoints,
        },
      });

      // 8. Atomically update User totalScore
      await tx.user.update({
        where: { id: currentUser.userId },
        data: {
          totalScore: { increment: totalPoints },
        },
      });

      return {
        attempt: updatedAttempt,
        correctCount,
        totalQuestions: questions.length,
        baseScore,
        speedBonus,
        orderBonus,
        submissionOrder,
        totalPoints,
      };
    });

    return NextResponse.json({
      success: true,
      message: "تم تسليم الكويز بنجاح!",
      result,
    });
  } catch (error: any) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ أثناء تسليم الكويز" },
      { status: 400 }
    );
  }
}
