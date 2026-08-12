import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "يرجى كتابة اسم الجوال/الجوالة وكلمة المرور" }, { status: 400 });
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 2) {
      return NextResponse.json({ error: "اسم الجوال/الجوالة يجب أن يكون أكثر من حرفين" }, { status: 400 });
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });

    if (existingUser) {
      return NextResponse.json({ error: "اسم الجوال/الجوالة مسجل بالفعل، يرجى تسجيل الدخول" }, { status: 400 });
    }

    // Always register as STUDENT (جوال / جوالة) - Admin can only be seeded
    const newUser = await prisma.user.create({
      data: {
        username: trimmedUsername,
        password: password, // Plain text password as per specifications
        role: "STUDENT",
        totalScore: 0,
      },
    });

    const token = signToken({
      userId: newUser.id,
      username: newUser.username,
      role: "STUDENT",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        totalScore: newUser.totalScore,
      },
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60, // 3 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}
