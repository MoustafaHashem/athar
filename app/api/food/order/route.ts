import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً لإرسال طلبك" }, { status: 401 });
    }

    // Verify if food form is currently open
    const config = await (prisma as any).foodFormState.findUnique({
      where: { id: 1 },
    });

    if (!config || !config.isOpen) {
      return NextResponse.json({ error: "استمارة طلبات الأكل مغلقة حالياً بواسطة إدارة الدراسة" }, { status: 400 });
    }

    const { restaurantName, mealName, price } = await request.json();

    if (!restaurantName || !mealName || price === undefined || price === null) {
      return NextResponse.json({ error: "يرجى اختيار المطعم وإدخال اسم الوجبة وسعرها الصحيح" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "سعر الوجبة غير صحيح" }, { status: 400 });
    }

    const newOrder = await (prisma as any).foodOrder.create({
      data: {
        userId: currentUser.userId,
        day: config.activeDay,
        restaurantName: String(restaurantName).trim(),
        mealName: String(mealName).trim(),
        price: parsedPrice,
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم تسجيل طلبك بنجاح لـ (${newOrder.restaurantName}) 🎉`,
      order: newOrder,
    });
  } catch (error) {
    console.error("Food order POST error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ طلب الوجبة" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك باستعراض طلبات الأكل" }, { status: 403 });
    }

    const orders = await (prisma as any).foodOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Food order GET error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب طلبات الطعام" }, { status: 500 });
  }
}
