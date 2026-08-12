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

    await prisma.session.update({
      where: { id: sessionId },
      data: { isUnlocked: false },
    });

    return NextResponse.json({
      success: true,
      message: `تم قفل الجلسة رقم ${sessionId} بنجاح.`,
    });
  } catch (error) {
    console.error("Lock session error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء قفل الجلسة" }, { status: 500 });
  }
}
