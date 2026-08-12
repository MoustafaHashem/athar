import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بإجراء هذا التعديل" }, { status: 403 });
    }

    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "رقم الجلسة غير صحيح" }, { status: 400 });
    }

    // Unlock targeted session without locking previously unlocked sessions
    await prisma.session.update({
      where: { id: sessionId },
      data: { isUnlocked: true },
    });

    return NextResponse.json({
      success: true,
      message: `تم إعلان انتهاء المحاضرة رقم ${sessionId} وفتح الكويز بنجاح.`,
    });
  } catch (error) {
    console.error("Unlock session error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء فتح الجلسة" }, { status: 500 });
  }
}
