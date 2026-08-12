"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle2, Trophy, Zap, Clock, ArrowLeft, ShieldAlert, Award } from "lucide-react";

interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface SessionData {
  id: number;
  order: number;
  title: string;
  phaseName: string;
  instructor: {
    name: string;
    imagePath: string | null;
  } | null;
  questions: Question[];
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function initQuiz() {
      try {
        setLoading(true);
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        setUser(meData.user);

        const startRes = await fetch(`/api/quiz/${sessionId}/start`, { method: "POST" });
        const startData = await startRes.json();

        if (!startRes.ok) {
          setError(startData.error || "تعذر بدء الكويز");
          return;
        }

        setSession(startData.session);
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      initQuiz();
    }
  }, [sessionId]);

  const handleSelectOption = (questionId: number, option: "A" | "B" | "C" | "D") => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!session) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < session.questions.length) {
      if (!confirm("لم تقم بالإجابة على جميع الأسئلة بعد. هل تريد الإرسال على أي حال؟")) {
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/quiz/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء التسليم");
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError("تعذر التسليم. يرجى التأكد من الاتصال بالنت.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-olive border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-olive">جاري إعداد الكويز وحساب التوقيت...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex flex-col bg-sand">
        <Header user={user} />
        <main className="flex-1 max-w-xl w-full mx-auto p-4 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 border border-olive/20">
            <ShieldAlert className="w-16 h-16 text-gold mx-auto" />
            <h1 className="text-xl font-black text-olive-dark">تعذر الدخول للكويز</h1>
            <p className="text-sm font-semibold text-dark/70">{error}</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-olive text-white rounded-xl text-xs font-black shadow-md hover:bg-olive-dark transition-all"
            >
              العودة للجلسات
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sand">
      <Header user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Session Header Card */}
        {session && (
          <div className="olive-gradient rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-gold">
            <div className="space-y-1">
              <span className="bg-gold text-olive-dark text-xs font-black px-3 py-1 rounded-full">
                كويز المحاضرة #{session.order}
              </span>
              <h1 className="text-2xl font-black">{session.title}</h1>
              <p className="text-xs text-sand/80 font-bold">
                المرحلة: {session.phaseName} • القائد المحاضر: {session.instructor?.name || "القيادة"}
              </p>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <p className="text-[11px] font-bold text-sand">عدد الأسئلة</p>
              <p className="text-lg font-black text-gold">{session.questions.length} أسئلة</p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-red-100 border-r-4 border-red-500 text-red-800 text-xs font-bold rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Questions List */}
        {!result && session && (
          <div className="space-y-6">
            {session.questions.map((q, idx) => {
              const selectedOption = answers[q.id];

              const options = [
                { key: "A" as const, text: q.optionA },
                { key: "B" as const, text: q.optionB },
                { key: "C" as const, text: q.optionC },
                { key: "D" as const, text: q.optionD },
              ];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-olive/15 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold text-olive-dark font-black flex items-center justify-center shrink-0 shadow text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-base md:text-lg text-olive-dark pt-1">
                      {q.text}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {options.map((opt) => {
                      const isSelected = selectedOption === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          className={`p-4 rounded-2xl text-right text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-olive text-white border-gold ring-2 ring-gold/40 shadow-md"
                              : "bg-sand/30 hover:bg-sand/80 text-dark border-olive/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                                isSelected
                                  ? "bg-gold text-olive-dark"
                                  : "bg-olive/10 text-olive"
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 bg-olive hover:bg-olive-dark text-white font-black rounded-2xl text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>جاري حساب النقاط والبونص... ⚡</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-gold" />
                    <span>إرسال وتأكيد الإجابات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Screen Modal */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-gold text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-gold/20 text-gold-dark font-black flex items-center justify-center mx-auto shadow-inner border border-gold">
              <Trophy className="w-10 h-10 text-gold" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1 rounded-full">
                تم التسليم بنجاح 🎉
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-olive-dark mt-2">
                نتيجة كويز المحاضرة
              </h2>
              <p className="text-xs text-dark/70 font-semibold mt-1">
                إليك تفاصيل النقاط والبونص المستحق لك لهذه الجلسة:
              </p>
            </div>

            {/* Score Summary Box */}
            <div className="bg-sand/60 p-6 rounded-3xl border border-olive/15 max-w-lg mx-auto space-y-3 font-bold text-sm">
              <div className="flex justify-between items-center text-dark">
                <span>الإجابات الصحيحة:</span>
                <span className="text-olive font-extrabold">
                  {result.correctCount} من {result.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between items-center text-dark">
                <span>النقاط الأساسية:</span>
                <span className="text-olive font-extrabold">+{result.baseScore} نقطة</span>
              </div>
              <div className="flex justify-between items-center text-gold-dark">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-gold fill-gold" />
                  <span>بونص السرعة:</span>
                </span>
                <span className="font-black text-gold">+{result.speedBonus} نقطة</span>
              </div>
              <div className="flex justify-between items-center text-gold-dark">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-gold" />
                  <span>بونص الأسبقية (الترتيب #{result.submissionOrder}):</span>
                </span>
                <span className="font-black text-gold">+{result.orderBonus} نقطة</span>
              </div>

              <div className="pt-3 border-t border-olive/20 flex justify-between items-center text-lg sm:text-xl font-black text-olive-dark">
                <span>إجمالي النقاط المكتسبة:</span>
                <span className="text-gold font-black text-2xl">+{result.totalPoints} نقطة ⭐</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 bg-olive hover:bg-olive-dark text-white font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة لصفحة الجلسات</span>
              </Link>
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold hover:bg-gold-light text-olive-dark font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>مشاهدة لوحة الشرف</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
