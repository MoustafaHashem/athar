import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك باستعراض الأسئلة" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionIdParam = searchParams.get("sessionId");

    if (!sessionIdParam) {
      return NextResponse.json({ error: "يرجى تحديد رقم الجلسة" }, { status: 400 });
    }

    const sessionId = parseInt(sessionIdParam, 10);
    const questions = await prisma.question.findMany({
      where: { sessionId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الأسئلة" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بإضافة أسئلة" }, { status: 403 });
    }

    const { sessionId, text, optionA, optionB, optionC, optionD, correctOption } = await request.json();

    if (!sessionId || !text || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      return NextResponse.json({ error: "يرجى ملء جميع الحقول والخيارات للسؤال" }, { status: 400 });
    }

    const parsedSessionId = typeof sessionId === "string" ? parseInt(sessionId, 10) : sessionId;
    const validCorrectOption = String(correctOption).toUpperCase();

    if (!["A", "B", "C", "D"].includes(validCorrectOption)) {
      return NextResponse.json({ error: "الخيار الصحيح يجب أن يكون A أو B أو C أو D" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        sessionId: parsedSessionId,
        text: String(text).trim(),
        optionA: String(optionA).trim(),
        optionB: String(optionB).trim(),
        optionC: String(optionC).trim(),
        optionD: String(optionD).trim(),
        correctOption: validCorrectOption,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إضافة السؤال بنجاح إلى المحاضرة 🎯",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ السؤال" }, { status: 500 });
  }
}
