import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بتعديل الأسئلة" }, { status: 403 });
    }

    const questionId = parseInt(params.id, 10);
    if (isNaN(questionId)) {
      return NextResponse.json({ error: "رقم السؤال غير صحيح" }, { status: 400 });
    }

    const { text, optionA, optionB, optionC, optionD, correctOption } = await request.json();

    if (!text || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      return NextResponse.json({ error: "يرجى استكمال كافة بيانات السؤال والخيارات" }, { status: 400 });
    }

    const validCorrectOption = String(correctOption).toUpperCase();
    if (!["A", "B", "C", "D"].includes(validCorrectOption)) {
      return NextResponse.json({ error: "الإجابة الصحيحة يجب أن تكون A أو B أو C أو D" }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
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
      message: "تم تعديل السؤال بنجاح ✏️",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تعديل السؤال" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بحذف الأسئلة" }, { status: 403 });
    }

    const questionId = parseInt(params.id, 10);
    if (isNaN(questionId)) {
      return NextResponse.json({ error: "رقم السؤال غير صحيح" }, { status: 400 });
    }

    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف السؤال بنجاح 🗑️",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حذف السؤال" }, { status: 500 });
  }
}
