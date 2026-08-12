"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Trophy, LayoutDashboard, Shield, Sparkles } from "lucide-react";

interface HeaderProps {
  user?: {
    username: string;
    role: string;
    totalScore?: number;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="olive-gradient text-white border-b-4 border-gold sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full border-2 border-gold overflow-hidden bg-white p-0.5 shadow-md transition-transform group-hover:scale-105">
            <Image
              src="/images/branding/logo.jpg"
              alt="أثر"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white tracking-wide">أثر</span>
              <span className="bg-gold text-olive-dark text-[10px] font-black px-2 py-0.5 rounded-full">
                إعداد القادة
              </span>
            </div>
            <p className="text-[11px] text-gold/90 font-bold hidden sm:block">
              القائد الحقيقي يصنع أثرًا
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        {user && (
          <nav className="flex items-center gap-2 md:gap-4">
            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === "/admin"
                    ? "bg-gold text-olive-dark shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === "/dashboard"
                    ? "bg-gold text-olive-dark shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>الجلسات</span>
              </Link>
            )}

            <Link
              href="/leaderboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                pathname === "/leaderboard"
                  ? "bg-gold text-olive-dark shadow-md"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Trophy className="w-4 h-4 text-gold-light" />
              <span>لوحة الشرف</span>
            </Link>

            {/* User Profile Pill */}
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <div className="w-7 h-7 rounded-full bg-gold text-olive-dark font-black flex items-center justify-center text-xs">
                {user.username.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-tight">{user.username}</p>
                {user.role === "STUDENT" && (
                  <p className="text-[10px] text-gold font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{user.totalScore || 0} نقطة</span>
                  </p>
                )}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-white transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
