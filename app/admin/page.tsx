"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Unlock, ShieldAlert, Trophy, MessageSquare, ListCheck, RefreshCw, CheckCircle2, Star, Plus, Trash2, HelpCircle, X, BookOpen, Edit3, Utensils, Store, DollarSign, ShoppingBag, Filter } from "lucide-react";

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
  questionCount?: number;
  attemptsCount?: number;
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
  rating?: number;
  reviewText: string;
  createdAt: string;
  sessionTitle: string;
}

interface GeneralFeedbackItem {
  id: number;
  category: "PROGRAM" | "TEAM_MEMBER" | "INSTRUCTOR" | "MEDIA" | "CATERING";
  targetName: string | null;
  rating: number;
  reviewText: string | null;
  createdAt: string;
}

interface FoodOrderAdminItem {
  id: number;
  userId: number;
  user: { username: string };
  day: string;
  restaurantName: string;
  mealName: string;
  price: number;
  createdAt: string;
}

interface FoodConfig {
  isOpen: boolean;
  activeDay: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [generalFeedbacks, setGeneralFeedbacks] = useState<GeneralFeedbackItem[]>([]);
  
  // Food Orders State
  const [foodOrders, setFoodOrders] = useState<FoodOrderAdminItem[]>([]);
  const [foodConfig, setFoodConfig] = useState<FoodConfig>({
    isOpen: false,
    activeDay: "اليوم الأول: الخميس 13 أغسطس",
  });
  const [foodDayFilter, setFoodDayFilter] = useState<string>("ALL");
  const [foodRestaurantFilter, setFoodRestaurantFilter] = useState<string>("ALL");
  const [updatingFoodConfig, setUpdatingFoodConfig] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"sessions" | "leaderboard" | "feedbacks" | "food">("sessions");
  
  // Feedback Sub-tab & Filter States
  const [feedbackCategory, setFeedbackCategory] = useState<"SESSIONS" | "PROGRAM" | "TEAM_MEMBER" | "INSTRUCTOR" | "MEDIA" | "CATERING">("SESSIONS");
  const [sessionFilter, setSessionFilter] = useState<string>("ALL");
  const [targetFilter, setTargetFilter] = useState<string>("ALL");

  // Question Manager Modal State
  const [questionModal, setQuestionModal] = useState<{
    isOpen: boolean;
    sessionId: number | null;
    sessionTitle: string;
  }>({ isOpen: false, sessionId: null, sessionTitle: "" });

  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Question Form State (Creation & Editing & Deleting)
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptC] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qCorrect, setQCorrect] = useState<"A" | "B" | "C" | "D">("A");
  const [submittingQ, setSubmittingQ] = useState(false);
  const [qMsg, setQMsg] = useState("");

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

      const genFbRes = await fetch("/api/general-feedback");
      const genFbData = await genFbRes.json();
      setGeneralFeedbacks(genFbData.feedbacks || []);

      const foodCfgRes = await fetch("/api/food/config");
      const foodCfgData = await foodCfgRes.json();
      if (foodCfgData.config) setFoodConfig(foodCfgData.config);

      const foodOrdRes = await fetch("/api/food/order");
      const foodOrdData = await foodOrdRes.json();
      if (foodOrdData.orders) setFoodOrders(foodOrdData.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFoodForm = async (newIsOpen: boolean, newDay?: string) => {
    setUpdatingFoodConfig(true);
    try {
      const res = await fetch("/api/food/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isOpen: newIsOpen,
          activeDay: newDay || foodConfig.activeDay,
        }),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setFoodConfig(data.config);
        setMessage({ text: data.message, type: "success" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingFoodConfig(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenQuestionModal = async (sessionId: number, sessionTitle: string) => {
    setQuestionModal({ isOpen: true, sessionId, sessionTitle });
    handleCancelEdit();
    setConfirmDeleteId(null);
    setQMsg("");
    await fetchSessionQuestions(sessionId);
  };

  const fetchSessionQuestions = async (sessionId: number) => {
    try {
      setLoadingQuestions(true);
      const res = await fetch(`/api/questions?sessionId=${sessionId}`);
      const data = await res.json();
      setSessionQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleStartEditQuestion = (q: any) => {
    setEditingQuestionId(q.id);
    setConfirmDeleteId(null);
    setQText(q.text);
    setQOptA(q.optionA);
    setQOptB(q.optionB);
    setQOptC(q.optionC);
    setQOptD(q.optionD);
    setQCorrect(q.correctOption);
    setQMsg("✏️ جاري التعديل على هذا السؤال. اضغط حفظ عند الانتهاء.");
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setConfirmDeleteId(null);
    setQText("");
    setQOptA("");
    setQOptB("");
    setQOptC("");
    setQOptD("");
    setQCorrect("A");
    setQMsg("");
  };

  const handleCreateOrUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionModal.sessionId || !qText.trim() || !qOptA.trim() || !qOptB.trim() || !qOptC.trim() || !qOptD.trim()) return;

    setSubmittingQ(true);
    setQMsg("");

    const isEditing = editingQuestionId !== null;
    const url = isEditing ? `/api/questions/${editingQuestionId}` : "/api/questions";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: questionModal.sessionId,
          text: qText,
          optionA: qOptA,
          optionB: qOptB,
          optionC: qOptC,
          optionD: qOptD,
          correctOption: qCorrect,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setQMsg(`⚠️ ${data.error || "حدث خطأ أثناء حفظ السؤال"}`);
      } else {
        setQMsg(isEditing ? "✅ تم تعديل السؤال بنجاح! ✏️" : "✅ تم إضافة السؤال بنجاح! 🎯");
        handleCancelEdit();
        await fetchSessionQuestions(questionModal.sessionId);
        await fetchAdminData();
      }
    } catch (err) {
      setQMsg("⚠️ تعذر الاتصال بالخادم");
    } finally {
      setSubmittingQ(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      setQMsg("جاري حذف السؤال...");
      const res = await fetch(`/api/questions/${questionId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setQMsg(`⚠️ ${data.error || "حدث خطأ أثناء الحذف"}`);
      } else {
        setQMsg("🗑️ تم حذف السؤال بنجاح.");
        setConfirmDeleteId(null);
        if (editingQuestionId === questionId) {
          handleCancelEdit();
        }
        if (questionModal.sessionId) {
          await fetchSessionQuestions(questionModal.sessionId);
          await fetchAdminData();
        }
      }
    } catch (err) {
      setQMsg("⚠️ تعذر حذف السؤال، يرجى المحاولة مرة أخرى.");
    }
  };

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
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-olive/15 shadow-sm max-w-3xl">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
            className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
            className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "feedbacks"
                ? "bg-olive text-white shadow-md"
                : "text-olive/80 hover:bg-sand/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>التقييمات ({feedbacks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("food")}
            className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "food"
                ? "bg-olive text-white shadow-md"
                : "text-olive/80 hover:bg-sand/50"
            }`}
          >
            <Utensils className="w-4 h-4 text-gold" />
            <span>طلبات الأكل ({foodOrders.length})</span>
          </button>
        </div>

        {/* Tab Content: Sessions List */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <div className="bg-sand/60 p-4 rounded-2xl border border-gold/30 text-xs md:text-sm font-extrabold text-olive-dark flex items-start gap-2 shadow-sm">
              <span className="text-base">💡</span>
              <p className="leading-relaxed">
                <strong>تعليمات إدارة الجلسات:</strong> فور انتهاء المحاضرة الفعلي في القاعة، قُم بالضغط على <strong>"إعلان انتهاء المحاضرة وفتح الكويز 🔓"</strong> لتمكين الجوالين من تقديم التقييم المجهول وتأدية الكويز. الجلسات السابقة تظل مفتوحة تلقائياً للجوالين طوال فترة البرنامج.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-md relative flex flex-col justify-between ${
                    session.isUnlocked
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-900/5"
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
                            <span>انتهت والمجال مفتوح 🟢</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span>لم تنتهِ بعد ⏳</span>
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

                  <div className="pt-4 border-t border-sand-dark flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpenQuestionModal(session.id, session.title)}
                      className="py-2 px-3 bg-gold/20 hover:bg-gold text-olive-dark font-black rounded-xl text-xs border border-gold/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>أسئلة الكويز ({session.questionCount ?? session._count?.questions ?? 0}) 📝</span>
                    </button>

                    <button
                      onClick={() => handleToggleUnlock(session)}
                      disabled={actionLoading === session.id}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all shadow cursor-pointer flex items-center gap-1.5 ${
                        session.isUnlocked
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white"
                      }`}
                    >
                      {actionLoading === session.id ? (
                        <span>جاري...</span>
                      ) : session.isUnlocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>إغلاق الكويز 🔒</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-gold" />
                          <span>إعلان انتهاء المحاضرة 🔓</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

        {/* Tab Content: Feedbacks Center */}
        {activeTab === "feedbacks" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-olive/15 space-y-6">
            <div>
              <h2 className="text-xl font-black text-olive-dark flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-olive" />
                <span>مركز استعراض التقييمات السرية الشاملة</span>
              </h2>
              <p className="text-xs text-dark/60 font-semibold mt-1">
                استعرض آراء وتقييمات المشاركين المجهولة الموزعة حسب الفئات مع إمكانية التصفية المتقدمة.
              </p>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex flex-wrap gap-2 bg-sand/40 p-2 rounded-2xl border border-olive/10">
              <button
                onClick={() => { setFeedbackCategory("SESSIONS"); setSessionFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "SESSIONS"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>📚 الجلسات ({feedbacks.length})</span>
              </button>

              <button
                onClick={() => { setFeedbackCategory("PROGRAM"); setTargetFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "PROGRAM"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>🌟 البرنامج العام ({generalFeedbacks.filter((f) => f.category === "PROGRAM").length})</span>
              </button>

              <button
                onClick={() => { setFeedbackCategory("TEAM_MEMBER"); setTargetFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "TEAM_MEMBER"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>👔 فريق الهيكل ({generalFeedbacks.filter((f) => f.category === "TEAM_MEMBER").length})</span>
              </button>

              <button
                onClick={() => { setFeedbackCategory("INSTRUCTOR"); setTargetFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "INSTRUCTOR"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>🎙️ القادة والمحاضرين ({generalFeedbacks.filter((f) => f.category === "INSTRUCTOR").length})</span>
              </button>

              <button
                onClick={() => { setFeedbackCategory("MEDIA"); setTargetFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "MEDIA"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>📸 التغطية والميديا ({generalFeedbacks.filter((f) => f.category === "MEDIA").length})</span>
              </button>

              <button
                onClick={() => { setFeedbackCategory("CATERING"); setTargetFilter("ALL"); }}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackCategory === "CATERING"
                    ? "bg-olive text-white shadow-md"
                    : "text-olive hover:bg-white/60"
                }`}
              >
                <span>🍱 التغذية والإعاشة ({generalFeedbacks.filter((f) => f.category === "CATERING").length})</span>
              </button>
            </div>

            {/* Category Filter Controls & Summary Stats */}
            <div className="bg-sand/60 p-4 rounded-2xl border border-olive/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-olive">فلترة التقييمات:</span>

                {/* Session Filter Dropdown */}
                {feedbackCategory === "SESSIONS" && (
                  <select
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-olive/20 rounded-xl text-xs font-bold text-olive-dark focus:outline-none"
                  >
                    <option value="ALL">جميع الجلسات والـ 14 محاضرة</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        محاضرة #{s.order}: {s.title}
                      </option>
                    ))}
                  </select>
                )}

                {/* Team Member Filter Dropdown */}
                {feedbackCategory === "TEAM_MEMBER" && (
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-olive/20 rounded-xl text-xs font-bold text-olive-dark focus:outline-none"
                  >
                    <option value="ALL">جميع أعضاء فريق الهيكل</option>
                    {Array.from(
                      new Set(generalFeedbacks.filter((f) => f.category === "TEAM_MEMBER").map((f) => f.targetName).filter(Boolean))
                    ).map((name) => (
                      <option key={name} value={name!}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Instructor Filter Dropdown */}
                {feedbackCategory === "INSTRUCTOR" && (
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-olive/20 rounded-xl text-xs font-bold text-olive-dark focus:outline-none"
                  >
                    <option value="ALL">جميع القادة والمحاضرين</option>
                    {Array.from(
                      new Set(generalFeedbacks.filter((f) => f.category === "INSTRUCTOR").map((f) => f.targetName).filter(Boolean))
                    ).map((name) => (
                      <option key={name} value={name!}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Average Rating Summary */}
              {(() => {
                const list =
                  feedbackCategory === "SESSIONS"
                    ? feedbacks.filter((f) => sessionFilter === "ALL" || f.sessionId === parseInt(sessionFilter, 10))
                    : generalFeedbacks.filter(
                        (f) =>
                          f.category === feedbackCategory &&
                          (targetFilter === "ALL" || f.targetName === targetFilter)
                      );
                const count = list.length;
                const avg =
                  count > 0
                    ? (list.reduce((acc, curr) => acc + (curr.rating || 5), 0) / count).toFixed(1)
                    : "0";

                return (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-dark/70">
                      عدد التقييمات: <strong>{count}</strong>
                    </span>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-gold/40 shadow-sm text-gold-dark font-black text-xs">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span>متوسط التقييم: {avg} / 5</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Feedbacks Display Cards Grid */}
            <div className="space-y-3 pt-2">
              {feedbackCategory === "SESSIONS" ? (
                feedbacks
                  .filter((item) => sessionFilter === "ALL" || item.sessionId === parseInt(sessionFilter, 10))
                  .map((item) => (
                    <div key={item.id} className="bg-sand/40 p-4 rounded-2xl border border-olive/10 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-olive">
                        <span>📚 {item.sessionTitle}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-gold/40 shadow-sm text-gold-dark font-extrabold text-[11px]">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                            <span>{item.rating ?? 5} / 5</span>
                          </div>
                          <span className="text-dark/40 font-normal">
                            {new Date(item.createdAt).toLocaleString("ar-EG")}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-dark font-semibold leading-relaxed bg-white p-3 rounded-xl border border-olive/5">
                        "{item.reviewText}"
                      </p>
                    </div>
                  ))
              ) : (
                generalFeedbacks
                  .filter(
                    (item) =>
                      item.category === feedbackCategory &&
                      (targetFilter === "ALL" || item.targetName === targetFilter)
                  )
                  .map((item) => (
                    <div key={item.id} className="bg-sand/40 p-4 rounded-2xl border border-olive/10 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-olive">
                        <span>
                          {item.category === "PROGRAM" && "🌟 تقييم البرنامج العام"}
                          {item.category === "TEAM_MEMBER" && `👔 عضو الهيكل: ${item.targetName || "غير محدد"}`}
                          {item.category === "INSTRUCTOR" && `🎙️ المحاضر: ${item.targetName || "غير محدد"}`}
                          {item.category === "MEDIA" && "📸 تقييم التغطية والميديا"}
                          {item.category === "CATERING" && "🍱 تقييم التغذية والإعاشة"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-gold/40 shadow-sm text-gold-dark font-extrabold text-[11px]">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                            <span>{item.rating} / 5</span>
                          </div>
                          <span className="text-dark/40 font-normal">
                            {new Date(item.createdAt).toLocaleString("ar-EG")}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-dark font-semibold leading-relaxed bg-white p-3 rounded-xl border border-olive/5">
                        {item.reviewText ? `"${item.reviewText}"` : <span className="text-dark/40 italic">لا توجد ملاحظات مكتوبة (تقييم بالنجوم فقط).</span>}
                      </p>
                    </div>
                  ))
              )}

              {((feedbackCategory === "SESSIONS" &&
                feedbacks.filter((item) => sessionFilter === "ALL" || item.sessionId === parseInt(sessionFilter, 10)).length === 0) ||
                (feedbackCategory !== "SESSIONS" &&
                  generalFeedbacks.filter(
                    (item) =>
                      item.category === feedbackCategory &&
                      (targetFilter === "ALL" || item.targetName === targetFilter)
                  ).length === 0)) && (
                <div className="py-12 text-center text-dark/50 font-bold bg-sand/20 rounded-2xl border border-dashed border-olive/20">
                  لم يتم إدخال أي تقييمات سرية في هذه الفئة أو التصفية حتى الآن.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "food" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Control Panel Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-olive/15 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center font-black text-xl">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-olive-dark">
                      إدارة وتفعيل استمارة طلبات الأكل 🍱
                    </h2>
                    <p className="text-xs text-dark/70 font-semibold mt-0.5">
                      يمكنك فتح الاستمارة وتحديد اليوم النشط ليتمكن الطلاب من طلب وجباتهم.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    foodConfig.isOpen
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${foodConfig.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    <span>{foodConfig.isOpen ? "الاستمارة مفتوحة للطلاب 🟢" : "الاستمارة مغلقة 🔴"}</span>
                  </span>
                </div>
              </div>

              {/* Form Config Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-sand/30 p-5 rounded-2xl border border-olive/10">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-black text-olive">
                    اختر اليوم النشط لاستمارة وجبات الأكل:
                  </label>
                  <select
                    value={foodConfig.activeDay}
                    onChange={(e) => handleToggleFoodForm(foodConfig.isOpen, e.target.value)}
                    disabled={updatingFoodConfig}
                    className="w-full p-3 bg-white border border-olive/20 rounded-xl text-xs font-black text-olive-dark focus:outline-none"
                  >
                    <option value="اليوم الأول: الخميس 13 أغسطس">اليوم الأول: الخميس 13 أغسطس</option>
                    <option value="اليوم الثاني: الجمعة 14 أغسطس">اليوم الثاني: الجمعة 14 أغسطس</option>
                    <option value="اليوم الثالث: السبت 15 أغسطس">اليوم الثالث: السبت 15 أغسطس</option>
                  </select>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={updatingFoodConfig}
                    onClick={() => handleToggleFoodForm(!foodConfig.isOpen)}
                    className={`w-full py-3.5 px-6 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      foodConfig.isOpen
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <span>{updatingFoodConfig ? "جاري التحديث..." : foodConfig.isOpen ? "إغلاق استمارة الأكل 🔴" : "فتح استمارة الأكل للطلاب 🟢"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Statistics & Nested Filters */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-olive/15 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand pb-4">
                <div className="flex items-center gap-2 text-olive font-black text-lg">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <span>طلبات الوجبات المسجلة ({foodOrders.length})</span>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-olive" />
                    <span className="text-xs font-bold text-olive">فلتر اليوم:</span>
                    <select
                      value={foodDayFilter}
                      onChange={(e) => setFoodDayFilter(e.target.value)}
                      className="p-2 bg-sand/50 border border-olive/20 rounded-xl text-xs font-bold text-olive-dark focus:outline-none"
                    >
                      <option value="ALL">جميع الأيام</option>
                      <option value="اليوم الأول: الخميس 13 أغسطس">اليوم الأول: الخميس</option>
                      <option value="اليوم الثاني: الجمعة 14 أغسطس">اليوم الثاني: الجمعة</option>
                      <option value="اليوم الثالث: السبت 15 أغسطس">اليوم الثالث: السبت</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-olive" />
                    <span className="text-xs font-bold text-olive">فلتر المطعم:</span>
                    <select
                      value={foodRestaurantFilter}
                      onChange={(e) => setFoodRestaurantFilter(e.target.value)}
                      className="p-2 bg-sand/50 border border-olive/20 rounded-xl text-xs font-bold text-olive-dark focus:outline-none"
                    >
                      <option value="ALL">جميع المطاعم</option>
                      {Array.from(new Set(foodOrders.map((o) => o.restaurantName))).map((rest) => (
                        <option key={rest} value={rest}>
                          {rest}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Stat Summary Cards */}
              {(() => {
                const filtered = foodOrders.filter((o) => {
                  const matchDay = foodDayFilter === "ALL" || o.day === foodDayFilter;
                  const matchRest = foodRestaurantFilter === "ALL" || o.restaurantName === foodRestaurantFilter;
                  return matchDay && matchRest;
                });

                const totalMeals = filtered.length;
                const totalPriceSum = filtered.reduce((acc, curr) => acc + (curr.price || 0), 0);

                // Count per restaurant
                const restCounts: Record<string, number> = {};
                filtered.forEach((o) => {
                  restCounts[o.restaurantName] = (restCounts[o.restaurantName] || 0) + 1;
                });

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-sand/40 p-5 rounded-2xl border border-olive/15 text-center space-y-1">
                        <p className="text-xs font-bold text-dark/60">إجمالي عدد الوجبات المطلوبة</p>
                        <p className="text-2xl font-black text-olive-dark">{totalMeals} وجبة</p>
                      </div>

                      <div className="bg-amber-500/10 p-5 rounded-2xl border border-gold/40 text-center space-y-1">
                        <p className="text-xs font-bold text-amber-900">إجمالي المبلغ والمصروفات</p>
                        <p className="text-2xl font-black text-gold-dark">{totalPriceSum.toLocaleString("ar-EG")} جنيه</p>
                      </div>

                      <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-300 text-center space-y-1">
                        <p className="text-xs font-bold text-emerald-900">توزيع الطلبات حسب المطاعم</p>
                        <p className="text-xs font-extrabold text-emerald-800 pt-1">
                          {Object.entries(restCounts).map(([name, count]) => `${name}: ${count}`).join(" • ") || "لا توجد طلبات"}
                        </p>
                      </div>
                    </div>

                    {/* Table of Orders */}
                    {filtered.length > 0 ? (
                      <div className="overflow-x-auto border border-olive/15 rounded-2xl">
                        <table className="w-full text-right text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-olive/10 text-olive-dark font-black">
                              <th className="py-3 px-4">#</th>
                              <th className="py-3 px-4">اسم الجوال/ة</th>
                              <th className="py-3 px-4">اليوم النشط</th>
                              <th className="py-3 px-4">المطعم</th>
                              <th className="py-3 px-4">تفاصيل الوجبة المطلوبة</th>
                              <th className="py-3 px-4">السعر</th>
                              <th className="py-3 px-4">وقت الطلب</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-olive/10 bg-white">
                            {filtered.map((ord, idx) => (
                              <tr key={ord.id} className="hover:bg-sand/30 font-semibold">
                                <td className="py-3 px-4 font-black text-olive">{idx + 1}</td>
                                <td className="py-3 px-4 font-extrabold text-olive-dark">{ord.user?.username || `مستخدم #${ord.userId}`}</td>
                                <td className="py-3 px-4 text-xs font-bold text-dark/70">{ord.day}</td>
                                <td className="py-3 px-4 font-black text-gold-dark">{ord.restaurantName}</td>
                                <td className="py-3 px-4 font-extrabold text-dark">{ord.mealName}</td>
                                <td className="py-3 px-4 font-black text-emerald-700">{ord.price} جنيه</td>
                                <td className="py-3 px-4 text-xs text-dark/40 font-normal">
                                  {new Date(ord.createdAt).toLocaleString("ar-EG")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-dark/50 font-bold bg-sand/20 rounded-2xl border border-dashed border-olive/20">
                        لا توجد أي طلبات أكل مسجلة وفقاً للفلاتر المحددة.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      {/* Question Manager Modal */}
      {questionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-3xl my-8 rounded-3xl p-6 sm:p-8 shadow-2xl border border-olive/20 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand-dark pb-4">
              <div>
                <span className="bg-gold text-olive-dark text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  إدارة الكويز والأسئلة
                </span>
                <h3 className="text-lg sm:text-xl font-black text-olive-dark mt-1">
                  {questionModal.sessionTitle}
                </h3>
              </div>
              <button
                onClick={() => setQuestionModal({ isOpen: false, sessionId: null, sessionTitle: "" })}
                className="p-2 text-dark/40 hover:text-dark rounded-full hover:bg-sand transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Existing Questions */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-olive flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>الأسئلة الحالية لهذه المحاضرة ({sessionQuestions.length}):</span>
              </h4>

              {loadingQuestions ? (
                <p className="text-xs text-olive font-bold py-4 text-center">جاري تحميل الأسئلة...</p>
              ) : sessionQuestions.length > 0 ? (
                <div className="space-y-3">
                  {sessionQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-sand/40 p-4 rounded-2xl border border-olive/15 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-extrabold text-olive-dark">
                          {idx + 1}. {q.text}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {confirmDeleteId === q.id ? (
                            <div className="flex items-center gap-1.5 bg-red-100/80 p-1.5 rounded-xl border border-red-300 animate-fadeIn">
                              <span className="text-[10px] font-black text-red-800">تأكيد حذف السؤال؟</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-black shadow cursor-pointer transition-all"
                              >
                                نعم، احذف 🗑️
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-white hover:bg-gray-100 text-dark rounded-lg text-[11px] font-bold border border-gray-300 cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEditQuestion(q)}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer"
                                title="تعديل السؤال"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(q.id)}
                                className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer"
                                title="حذف السؤال"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold pt-1">
                        <div className={`p-2 rounded-xl border ${q.correctOption === "A" ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-900" : "bg-white border-olive/10"}`}>
                          أ) {q.optionA} {q.correctOption === "A" && "✓ (الإجابة الصحيحة)"}
                        </div>
                        <div className={`p-2 rounded-xl border ${q.correctOption === "B" ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-900" : "bg-white border-olive/10"}`}>
                          ب) {q.optionB} {q.correctOption === "B" && "✓ (الإجابة الصحيحة)"}
                        </div>
                        <div className={`p-2 rounded-xl border ${q.correctOption === "C" ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-900" : "bg-white border-olive/10"}`}>
                          ج) {q.optionC} {q.correctOption === "C" && "✓ (الإجابة الصحيحة)"}
                        </div>
                        <div className={`p-2 rounded-xl border ${q.correctOption === "D" ? "bg-emerald-100 border-emerald-400 font-bold text-emerald-900" : "bg-white border-olive/10"}`}>
                          د) {q.optionD} {q.correctOption === "D" && "✓ (الإجابة الصحيحة)"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-dark/50 text-xs font-bold bg-sand/20 rounded-2xl border border-dashed border-olive/20">
                  لا توجد أي أسئلة مضافة لهذه المحاضرة حتى الآن. الكويز غير متاح للجمهور حتى إضافة أسئلة.
                </div>
              )}
            </div>

            {/* Form for Creating or Editing Question */}
            <form onSubmit={handleCreateOrUpdateQuestion} className="bg-sand/60 p-5 rounded-2xl border border-gold/30 space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-olive-dark flex items-center gap-1.5">
                  {editingQuestionId ? <Edit3 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-gold" />}
                  <span>{editingQuestionId ? "تعديل السؤال الحالي ✏️" : "إضافة سؤال اختيار من متعدد (MCQ) جديد ➕"}</span>
                </h4>

                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-[11px] font-bold text-dark/60 hover:text-dark underline"
                  >
                    إلغاء التعديل والرجوع للإضافة
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-olive">نص السؤال:</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="مثال: ما هو المبدأ الكشفي الأول لقادة الجوالة؟"
                  className="w-full p-2.5 bg-white border border-olive/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-olive">الخيار (أ):</label>
                  <input
                    type="text"
                    required
                    value={qOptA}
                    onChange={(e) => setQOptA(e.target.value)}
                    className="w-full p-2 bg-white border border-olive/20 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-olive">الخيار (ب):</label>
                  <input
                    type="text"
                    required
                    value={qOptB}
                    onChange={(e) => setQOptB(e.target.value)}
                    className="w-full p-2 bg-white border border-olive/20 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-olive">الخيار (ج):</label>
                  <input
                    type="text"
                    required
                    value={qOptC}
                    onChange={(e) => setQOptC(e.target.value)}
                    className="w-full p-2 bg-white border border-olive/20 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-olive">الخيار (د):</label>
                  <input
                    type="text"
                    required
                    value={qOptD}
                    onChange={(e) => setQOptD(e.target.value)}
                    className="w-full p-2 bg-white border border-olive/20 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-extrabold text-olive">حدد الإجابة الصحيحة:</label>
                <div className="flex gap-4">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-xs font-black cursor-pointer text-olive">
                      <input
                        type="radio"
                        name="correctOpt"
                        value={opt}
                        checked={qCorrect === opt}
                        onChange={() => setQCorrect(opt)}
                        className="accent-olive"
                      />
                      <span>الخيار ({opt === "A" ? "أ" : opt === "B" ? "ب" : opt === "C" ? "ج" : "د"})</span>
                    </label>
                  ))}
                </div>
              </div>

              {qMsg && <p className="text-xs font-bold p-2 rounded-lg bg-sand border border-olive/10">{qMsg}</p>}

              <div className="pt-2 flex justify-end gap-2">
                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-dark rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingQ}
                  className="px-6 py-2.5 bg-olive hover:bg-olive-dark text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {editingQuestionId ? <Edit3 className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4 text-gold" />}
                  <span>{submittingQ ? "جاري الحفظ..." : editingQuestionId ? "حفظ التعديلات ✏️" : "حفظ وإضافة السؤال 🎯"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
