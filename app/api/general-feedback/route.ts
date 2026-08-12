import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { category, targetName, rating, reviewText } = await request.json();

    const validCategories = ["PROGRAM", "TEAM_MEMBER", "INSTRUCTOR", "MEDIA", "CATERING"];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json({ error: "فئة التقييم غير صحيحة" }, { status: 400 });
    }

    const parsedRating = typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;
    const cleanReviewText = typeof reviewText === "string" ? reviewText.trim() : "";

    // Strictly 100% Anonymous save
    const feedback = await (prisma as any).generalFeedback.create({
      data: {
        category,
        targetName: targetName ? String(targetName).trim() : null,
        rating: parsedRating,
        reviewText: cleanReviewText || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال تقييمك بنجاح، شكرًا لمساهمتك السريّة 🔒",
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error("General feedback POST error:", error);
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
    const categoryParam = searchParams.get("category");
    const targetNameParam = searchParams.get("targetName");

    const whereCondition: any = {};
    if (categoryParam) {
      whereCondition.category = categoryParam;
    }
    if (targetNameParam) {
      whereCondition.targetName = targetNameParam;
    }

    const feedbacks = await (prisma as any).generalFeedback.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error("General feedback GET error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب التقييمات" }, { status: 500 });
  }
}
