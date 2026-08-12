import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { sessionId, rating, reviewText } = await request.json();

    if (!sessionId || !reviewText || typeof reviewText !== "string" || !reviewText.trim()) {
      return NextResponse.json({ error: "يرجى اختيار المحاضرة وكتابة نص التقييم" }, { status: 400 });
    }

    const parsedSessionId = typeof sessionId === "string" ? parseInt(sessionId, 10) : sessionId;
    const parsedRating = typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;

    const session = await prisma.session.findUnique({
      where: { id: parsedSessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "المحاضرة غير موجودة" }, { status: 404 });
    }

    // Save strictly WITHOUT userId or IP address for 100% total anonymity
    const feedback = await (prisma.feedback as any).create({
      data: {
        sessionId: parsedSessionId,
        rating: parsedRating,
        reviewText: reviewText.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال التقييم السري بنجاح، شكرًا لمشاركتك 🔒",
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error("Feedback creation error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال التقييم" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك باستعراض التقييمات" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionIdParam = searchParams.get("sessionId");

    const whereCondition = sessionIdParam
      ? { sessionId: parseInt(sessionIdParam, 10) }
      : {};

    const feedbacks = await (prisma.feedback as any).findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        session: {
          select: {
            title: true,
            order: true,
          },
        },
      },
    });

    const formattedFeedbacks = feedbacks.map((fb: any) => ({
      id: fb.id,
      sessionId: fb.sessionId,
      rating: fb.rating ?? 5,
      reviewText: fb.reviewText,
      createdAt: fb.createdAt,
      sessionTitle: `محاضرة #${fb.session.order}: ${fb.session.title}`,
    }));

    return NextResponse.json({ feedbacks: formattedFeedbacks });
  } catch (error) {
    console.error("Fetch feedback error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب التقييمات" }, { status: 500 });
  }
}
