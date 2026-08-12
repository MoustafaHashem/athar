"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Compass, User, Lock, ArrowLeft, Footprints, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء الاتصال بالخادم");
        setLoading(false);
        return;
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-sand overflow-hidden">
      {/* Background Subtle Footprints & Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-wrap justify-around items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <Footprints key={i} className="w-16 h-16 text-olive transform rotate-45 m-8" />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-olive/15 overflow-hidden transition-all">
          {/* Header Section */}
          <div className="olive-gradient p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Compass className="w-32 h-32 text-gold" />
            </div>

            {/* Logo */}
            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full border-4 border-gold/60 overflow-hidden shadow-lg bg-white p-1">
              <Image
                src="/images/branding/logo.jpg"
                alt="لوجو أثر"
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            <h1 className="text-2xl font-black text-white tracking-wide">
              منصة أثر
            </h1>
            <p className="text-gold text-xs font-semibold mt-1 tracking-wider">
              برنامج إعداد القادة — عشيرة جوالة كلية الهندسة
            </p>
            <div className="inline-block mt-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold/30">
              <span className="text-xs text-sand font-bold">
                "القائد الحقيقي يصنع أثرًا"
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {/* Tabs */}
            <div className="flex bg-sand/80 p-1.5 rounded-2xl mb-6 border border-olive/10">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isLogin
                    ? "bg-olive text-white shadow-md"
                    : "text-olive/80 hover:text-olive"
                }`}
              >
                دخول الجوالين
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  !isLogin
                    ? "bg-olive text-white shadow-md"
                    : "text-olive/80 hover:text-olive"
                }`}
              >
                حساب جديد
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-olive-dark mb-1.5">
                  اسم الجوال / الجوالة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-olive/50">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isLogin ? "ادخل اسمك المسجل" : "ادخل اسمك الكامل"}
                    className="w-full pr-11 pl-4 py-3 bg-sand/40 border border-olive/20 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-olive-dark mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-olive/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ادخل كلمة المرور"
                    className="w-full pr-11 pl-4 py-3 bg-sand/40 border border-olive/20 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-olive hover:bg-olive-dark text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6 group cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <span>{isLogin ? "تسجيل الدخول" : "إنشاء حساب جوال جديد"}</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Scout Notice */}
            <div className="mt-6 pt-4 border-t border-olive/10 text-center text-xs text-olive/70 font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>عشيرة جوالة كلية الهندسة — جامعة عين شمس</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
