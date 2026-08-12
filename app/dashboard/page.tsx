"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionCard from "@/components/SessionCard";
import { Sparkles, Trophy, Compass, MessageSquare, Check, X, ShieldCheck } from "lucide-react";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    sessionId: number | null;
    sessionTitle: string;
  }>({ isOpen: false, sessionId: null, sessionTitle: "" });
  const [reviewText, setReviewText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);

      const sessRes = await fetch("/api/sessions");
      const sessData = await sessRes.json();
      setSessions(sessData.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenFeedback = (sessionId: number, sessionTitle: string) => {
    setFeedbackModal({ isOpen: true, sessionId, sessionTitle });
    setReviewText("");
    setFeedbackSuccess(false);
    setFeedbackError("");
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !feedbackModal.sessionId) return;

    setSubmittingFeedback(true);
    setFeedbackError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: feedbackModal.sessionId,
          reviewText: reviewText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackError(data.error || "حدث خطأ أثناء إرسال التقييم");
      } else {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackModal({ isOpen: false, sessionId: null, sessionTitle: "" });
        }, 1500);
      }
    } catch (err) {
      setFeedbackError("تعذر الاتصال بالخادم");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-olive border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-olive">جاري تحميل لوحة الجوال...</p>
        </div>
      </div>
    );
  }

  const activeUnlockedSession = sessions.find((s) => s.isUnlocked);
  const completedCount = sessions.filter((s) => s.userAttempt?.isSubmitted).length;

  return (
    <div className="min-h-screen flex flex-col bg-sand">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="olive-gradient rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border-b-4 border-gold">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Compass className="w-64 h-64 text-gold" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-extrabold text-gold border border-gold/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>عشيرة جوالة كلية الهندسة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                مرحباً بك، القائد/ة {user?.username} 🌟
              </h1>
              <p className="text-xs sm:text-sm text-sand/90 font-bold">
                تابع كويزات المحاضرات واكتسب النقاط لتتصدر لوحة الشرف!
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-gold text-olive-dark font-black flex items-center justify-center shadow-md">
                <Trophy className="w-6 h-6 text-olive-dark" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-sand">مجموع نقاطك</p>
                <p className="text-2xl sm:text-3xl font-black text-gold">
                  {user?.totalScore || 0} <span className="text-xs font-bold text-white">نقطة</span>
                </p>
                <p className="text-[10px] text-white/70 font-semibold mt-0.5">
                  أنجزت {completedCount} من 14 كويز
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Unlocked Session Callout */}
        {activeUnlockedSession && (
          <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-sand p-6 rounded-3xl border-2 border-gold shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold text-olive-dark font-black flex items-center justify-center animate-bounce shadow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="bg-gold text-olive-dark text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    المحاضرة المفتوحة الآن!
                  </span>
                  <h2 className="text-lg font-black text-olive-dark mt-1">
                    #{activeUnlockedSession.order} — {activeUnlockedSession.title}
                  </h2>
                </div>
              </div>
              <a
                href={`/session/${activeUnlockedSession.id}/quiz`}
                className="w-full sm:w-auto px-6 py-3 bg-olive hover:bg-olive-dark text-white rounded-xl text-xs font-black shadow-md transition-all text-center"
              >
                الدخول للكويز مباشرة ⚡
              </a>
            </div>
          </div>
        )}

        {/* Sessions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-olive-dark flex items-center gap-2">
              <span>جلسات برنامج إعداد القادة (14 محاضرة)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onOpenFeedback={handleOpenFeedback}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-olive/20 space-y-4 relative">
            <button
              onClick={() => setFeedbackModal({ isOpen: false, sessionId: null, sessionTitle: "" })}
              className="absolute top-4 left-4 p-2 text-dark/40 hover:text-dark rounded-full hover:bg-sand transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-olive font-black text-sm">
              <MessageSquare className="w-5 h-5 text-gold" />
              <span>تقييم مجهول لجلسة: {feedbackModal.sessionTitle}</span>
            </div>

            <p className="text-xs text-dark/70 font-semibold bg-sand/60 p-3 rounded-xl border border-olive/10">
              🔒 <strong>تأكيد السرية:</strong> إجابتك ستصل للمنظمين بدون أي إشارة لاسمك أو بياناتك إطلاقاً.
            </p>

            {feedbackSuccess ? (
              <div className="py-8 text-center space-y-2 text-emerald-700 font-bold">
                <Check className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="text-base">تم إرسال تقييمك بنجاح! شكرًا لمساهمتك.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-4">
                {feedbackError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl">
                    ⚠️ {feedbackError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-olive mb-1.5">
                    ما رأيك في المحاضرة وأسلوب القائد المحاضر؟
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="اكتب انطباعك أو أي ملاحظة تود مشاركتها بكل حرية..."
                    className="w-full p-3 bg-sand/30 border border-olive/20 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModal({ isOpen: false, sessionId: null, sessionTitle: "" })}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-dark/60 hover:bg-sand"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-6 py-2.5 bg-olive hover:bg-olive-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submittingFeedback ? "جاري الإرسال..." : "إرسال التقييم المجهول"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
