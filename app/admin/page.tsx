"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Unlock, ShieldAlert, Trophy, MessageSquare, ListCheck, RefreshCw, CheckCircle2 } from "lucide-react";

interface Instructor {
  id: number;
  name: string;
  imagePath: string | null;
}

interface Session {
  id: number;
  order: number;
  title: string;
  phaseName: string;
  day: string;
  isUnlocked: boolean;
  instructor: Instructor | null;
  _count?: {
    questions: number;
    attempts: number;
    feedbacks: number;
  };
}

interface LeaderboardUser {
  id: number;
  username: string;
  totalScore: number;
  attemptsCount: number;
}

interface FeedbackItem {
  id: number;
  sessionId: number;
  reviewText: string;
  createdAt: string;
  sessionTitle: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"sessions" | "leaderboard" | "feedbacks">("sessions");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);

      const sessRes = await fetch("/api/sessions");
      const sessData = await sessRes.json();
      setSessions(sessData.sessions || []);

      const lbRes = await fetch("/api/leaderboard?type=overall");
      const lbData = await lbRes.json();
      setLeaderboard(lbData.leaderboard || []);

      const fbRes = await fetch("/api/feedback");
      const fbData = await fbRes.json();
      setFeedbacks(fbData.feedbacks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUnlock = async (session: Session) => {
    setActionLoading(session.id);
    setMessage(null);

    const endpoint = session.isUnlocked
      ? `/api/sessions/${session.id}/lock`
      : `/api/sessions/${session.id}/unlock`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "حدث خطأ أثناء تغيير حالة الجلسة", type: "error" });
      } else {
        setMessage({ text: data.message, type: "success" });
        await fetchAdminData();
      }
    } catch (err) {
      setMessage({ text: "تعذر الاتصال بالخادم", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-olive border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-olive">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const unlockedCount = sessions.filter((s) => s.isUnlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-sand">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-olive/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-olive font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-gold" />
              <span>لوحة الإدارة للحدث</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-olive-dark">
              لوحة تحكم برنامج القادة (أثر)
            </h1>
            <p className="text-xs sm:text-sm text-dark/70 mt-1 font-semibold">
              إدارة فتح/قفل الكويزات للجلسات الـ 14 مباشرة ومتابعة النتائج.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-sand/60 px-4 py-3 rounded-2xl border border-olive/10">
            <div className="text-center px-2">
              <p className="text-xs font-bold text-dark/60">الجلسات المفتوحة</p>
              <p className="text-xl font-black text-olive">{unlockedCount} / 14</p>
            </div>
            <button
              onClick={fetchAdminData}
              title="تحديث البيانات"
              className="p-2.5 bg-olive text-white rounded-xl hover:bg-olive-dark transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl border font-bold text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-red-50 text-red-800 border-red-300"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <span>⚠️</span>}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-olive/15 shadow-sm max-w-xl">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "sessions"
                ? "bg-olive text-white shadow-md"
                : "text-olive/80 hover:bg-sand/50"
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>إدارة الجلسات ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-olive text-white shadow-md"
                : "text-olive/80 hover:bg-sand/50"
            }`}
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span>النتائج ({leaderboard.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "feedbacks"
                ? "bg-olive text-white shadow-md"
                : "text-olive/80 hover:bg-sand/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>التقييمات ({feedbacks.length})</span>
          </button>
        </div>

        {/* Tab Content: Sessions List */}
        {activeTab === "sessions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-md relative flex flex-col justify-between ${
                  session.isUnlocked
                    ? "border-gold ring-2 ring-gold/40 shadow-gold/20"
                    : "border-olive/15"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-olive/10 text-olive text-xs font-black px-3 py-1 rounded-full">
                      محاضرة #{session.order}
                    </span>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 ${
                        session.isUnlocked
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {session.isUnlocked ? (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>مفتوحة الآن</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-gray-500" />
                          <span>مغلقة</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-olive-dark mb-1">
                    {session.title}
                  </h3>

                  <div className="text-xs text-dark/70 space-y-1 mb-4 font-semibold">
                    <p className="text-olive">🏷️ {session.phaseName}</p>
                    <p className="text-dark/60">📅 {session.day}</p>
                    <p className="text-dark/60">👤 القائد: {session.instructor?.name || "غير محدد"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-dark flex items-center justify-between gap-2">
                  <div className="text-[11px] text-dark/60 font-semibold">
                    <span>{session._count?.questions || 0} أسئلة</span>
                    <span className="mx-1">•</span>
                    <span>{session._count?.attempts || 0} حلول</span>
                  </div>

                  <button
                    onClick={() => handleToggleUnlock(session)}
                    disabled={actionLoading === session.id}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5 ${
                      session.isUnlocked
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-olive hover:bg-olive-dark text-white"
                    }`}
                  >
                    {actionLoading === session.id ? (
                      <span>جاري...</span>
                    ) : session.isUnlocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>قفل الجلسة</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-gold" />
                        <span>فتح الجلسة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Leaderboard Summary */}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-olive/15">
            <h2 className="text-xl font-black text-olive-dark mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold" />
              <span>ترتيب الجوالين والمشاركين (إجمالي النقاط)</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-sand border-b border-olive/15 text-olive font-extrabold">
                    <th className="py-3 px-4"># الترتيب</th>
                    <th className="py-3 px-4">اسم الجوال / الجوالة</th>
                    <th className="py-3 px-4">الجلسات المكتملة</th>
                    <th className="py-3 px-4">مجموع النقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.map((member, idx) => (
                    <tr key={member.id} className="hover:bg-sand/30 font-semibold">
                      <td className="py-3 px-4 font-bold text-olive">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-olive-dark">{member.username}</td>
                      <td className="py-3 px-4">{member.attemptsCount} / 14</td>
                      <td className="py-3 px-4 text-gold font-black text-base">{member.totalScore} نقطة</td>
                    </tr>
                  ))}

                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-dark/60">
                        لا توجد نتائج مسجلة حتى الآن.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Feedbacks */}
        {activeTab === "feedbacks" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-olive/15 space-y-4">
            <h2 className="text-xl font-black text-olive-dark flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-olive" />
              <span>التقييمات والملاحظات السرية من الجوالين</span>
            </h2>
            <p className="text-xs text-dark/60 font-semibold">
              هذه الآراء مجهولة الهوية بالكامل لضمان الحرية والشفافية.
            </p>

            <div className="space-y-3 pt-2">
              {feedbacks.map((item) => (
                <div key={item.id} className="bg-sand/40 p-4 rounded-2xl border border-olive/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-olive">
                    <span>📚 {item.sessionTitle}</span>
                    <span className="text-dark/40 font-normal">
                      {new Date(item.createdAt).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <p className="text-sm text-dark font-semibold leading-relaxed bg-white p-3 rounded-xl border border-olive/5">
                    "{item.reviewText}"
                  </p>
                </div>
              ))}

              {feedbacks.length === 0 && (
                <div className="py-12 text-center text-dark/50 font-bold">
                  لم يتم إضافة أي تقييمات سرية حتى الآن.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
