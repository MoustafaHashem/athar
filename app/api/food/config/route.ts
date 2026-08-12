import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let config = await (prisma as any).foodFormState.findUnique({
      where: { id: 1 },
    });

    if (!config) {
      config = await (prisma as any).foodFormState.create({
        data: {
          id: 1,
          isOpen: false,
          activeDay: "اليوم الأول: الخميس 13 أغسطس",
        },
      });
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Food config GET error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب إعدادات التغذية" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بتعديل إعدادات التغذية" }, { status: 403 });
    }

    const { isOpen, activeDay } = await request.json();

    const config = await (prisma as any).foodFormState.upsert({
      where: { id: 1 },
      update: {
        isOpen: Boolean(isOpen),
        activeDay: activeDay ? String(activeDay).trim() : "اليوم الأول: الخميس 13 أغسطس",
      },
      create: {
        id: 1,
        isOpen: Boolean(isOpen),
        activeDay: activeDay ? String(activeDay).trim() : "اليوم الأول: الخميس 13 أغسطس",
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم ${config.isOpen ? "فتح 🟢" : "إغلاق 🔴"} استمارة طلبيات الأكل لـ (${config.activeDay}) بنجاح.`,
      config,
    });
  } catch (error) {
    console.error("Food config POST error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ الإعدادات" }, { status: 500 });
  }
}
