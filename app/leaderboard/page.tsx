"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Medal, Zap, Award, Sparkles, Users, BookOpen } from "lucide-react";

interface Session {
  id: number;
  order: number;
  title: string;
}

export default function LeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overall" | "session">("overall");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);

      const sessRes = await fetch("/api/sessions");
      const sessData = await sessRes.json();
      const sessList = sessData.sessions || [];
      setSessions(sessList);
      if (sessList.length > 0) {
        setSelectedSessionId(sessList[0].id.toString());
      }

      const lbRes = await fetch("/api/leaderboard?type=overall");
      const lbData = await lbRes.json();
      setLeaderboard(lbData.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleTabChange = async (tab: "overall" | "session") => {
    setActiveTab(tab);
    setLoading(true);
    try {
      if (tab === "overall") {
        const res = await fetch("/api/leaderboard?type=overall");
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } else if (selectedSessionId) {
        const res = await fetch(`/api/leaderboard?type=session&sessionId=${selectedSessionId}`);
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    if (activeTab !== "session") return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?type=session&sessionId=${sessionId}`);
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="min-h-screen flex flex-col bg-sand">
      <Header user={user} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Header */}
        <div className="olive-gradient rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden border-b-4 border-gold">
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold/40 mb-3">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-xs font-black text-gold">قائمة الشرف والمنافسة القيادية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">لوحة الشرف — فرقة الجوالين</h1>
          <p className="text-xs sm:text-sm text-sand/80 font-bold max-w-xl mx-auto mt-2">
            يتنافس الجوالون والجوالات على النقاط الأساسية وبونص السرعة والأسبقية في التسليم.
          </p>

          {/* Navigation Tabs */}
          <div className="flex bg-white/10 p-1.5 rounded-2xl max-w-md mx-auto mt-6 border border-white/15">
            <button
              onClick={() => handleTabChange("overall")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "overall"
                  ? "bg-gold text-olive-dark shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              🏆 الترتيب العام
            </button>
            <button
              onClick={() => handleTabChange("session")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "session"
                  ? "bg-gold text-olive-dark shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              📚 ترتيب محاضرة محددة
            </button>
          </div>
        </div>

        {/* Dropdown for session tab */}
        {activeTab === "session" && (
          <div className="bg-white p-4 rounded-2xl border border-olive/15 shadow-sm max-w-lg mx-auto flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-olive shrink-0" />
            <label className="text-xs font-black text-olive shrink-0">اختر المحاضرة:</label>
            <select
              value={selectedSessionId}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="w-full bg-sand/40 border border-olive/20 p-2.5 rounded-xl text-xs sm:text-sm font-bold text-olive-dark focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  محاضرة #{s.order}: {s.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Podium Top 3 Section (Only in Overall or if at least 3 exist) */}
        {!loading && leaderboard.length >= 2 && activeTab === "overall" && (
          <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-4 max-w-3xl mx-auto text-center">
            {/* Rank 2 (Silver) */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border-2 border-slate-300 shadow-xl space-y-2 relative order-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-700 font-black flex items-center justify-center mx-auto text-lg border border-slate-300 shadow">
                🥈
              </div>
              <h3 className="font-black text-xs md:text-base text-olive-dark truncate">
                {top2.username}
              </h3>
              <p className="text-xs md:text-sm font-extrabold text-slate-600">
                {top2.totalScore} نقطة
              </p>
              <span className="text-[10px] text-dark/50 font-semibold block">المركز الثاني</span>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border-4 border-gold shadow-2xl space-y-3 relative order-2 transform -translate-y-4 gold-glow">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold text-olive-dark font-black flex items-center justify-center mx-auto text-xl shadow border-2 border-gold-light animate-pulse">
                🥇
              </div>
              <h3 className="font-black text-sm md:text-xl text-olive-dark truncate">
                {top1.username}
              </h3>
              <p className="text-sm md:text-xl font-black text-gold">
                {top1.totalScore} <span className="text-xs">نقطة</span>
              </p>
              <span className="bg-gold/20 text-gold-dark text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                👑 القائد الأول
              </span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border-2 border-amber-600/40 shadow-xl space-y-2 relative order-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-50 text-amber-800 font-black flex items-center justify-center mx-auto text-lg border border-amber-600/30 shadow">
                🥉
              </div>
              <h3 className="font-black text-xs md:text-base text-olive-dark truncate">
                {top3 ? top3.username : "-"}
              </h3>
              <p className="text-xs md:text-sm font-extrabold text-amber-800">
                {top3 ? `${top3.totalScore} نقطة` : "-"}
              </p>
              <span className="text-[10px] text-dark/50 font-semibold block">المركز الثالث</span>
            </div>
          </div>
        )}

        {/* Full Table */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-olive/15">
          {loading ? (
            <div className="py-12 text-center text-olive font-bold">
              <div className="w-8 h-8 border-4 border-olive border-t-gold rounded-full animate-spin mx-auto mb-2"></div>
              جاري حساب وتحديث نتائج اللوحة...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead>
                  <tr className="bg-sand border-b border-olive/15 text-olive font-black">
                    <th className="py-3 px-4"># الترتيب</th>
                    <th className="py-3 px-4">اسم الجوال / الجوالة</th>
                    {activeTab === "overall" ? (
                      <>
                        <th className="py-3 px-4">الكويزات المكتملة</th>
                        <th className="py-3 px-4">إجمالي النقاط</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4">أساسي</th>
                        <th className="py-3 px-4 text-gold-dark">⚡ سرعة</th>
                        <th className="py-3 px-4 text-gold-dark">🏆 أسبقية</th>
                        <th className="py-3 px-4 font-black">المجموع</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.map((item) => (
                    <tr key={item.rank} className="hover:bg-sand/30 font-semibold transition-all">
                      <td className="py-3.5 px-4 font-black text-olive">
                        {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : `#${item.rank}`}
                      </td>
                      <td className="py-3.5 px-4 font-black text-olive-dark">{item.username}</td>

                      {activeTab === "overall" ? (
                        <>
                          <td className="py-3.5 px-4 text-dark/70">{item.attemptsCount} من 14</td>
                          <td className="py-3.5 px-4 text-gold font-black text-base">
                            {item.totalScore} نقطة
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3.5 px-4 text-olive">{item.baseScore}</td>
                          <td className="py-3.5 px-4 text-gold font-bold">+{item.speedBonus}</td>
                          <td className="py-3.5 px-4 text-gold font-bold">+{item.orderBonus}</td>
                          <td className="py-3.5 px-4 text-gold-dark font-black text-base">
                            {item.totalPoints} نقطة
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-dark/50 font-bold">
                        لا توجد إجابات مسجلة في هذه القائمة حتى الآن.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
