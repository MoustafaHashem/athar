"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Unlock, CheckCircle, Sparkles, MessageSquarePlus, User, Clock, ArrowLeft } from "lucide-react";

interface Instructor {
  id: number;
  name: string;
  bio: string | null;
  imagePath: string | null;
}

interface UserAttempt {
  id: number;
  isSubmitted: boolean;
  correctCount: number;
  baseScore: number;
  speedBonus: number;
  orderBonus: number;
  totalPoints: number;
}

export interface SessionCardProps {
  session: {
    id: number;
    order: number;
    title: string;
    phaseName: string;
    day: string;
    isUnlocked: boolean;
    instructor: Instructor | null;
    questionCount: number;
    userAttempt: UserAttempt | null;
  };
  onOpenFeedback: (sessionId: number, sessionTitle: string) => void;
}

export default function SessionCard({ session, onOpenFeedback }: SessionCardProps) {
  const isSolved = Boolean(session.userAttempt?.isSubmitted);

  return (
    <div
      className={`rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white shadow-lg ${
        !session.isUnlocked
          ? "opacity-60 grayscale bg-sand/30 border border-dark/10"
          : isSolved
          ? "border-2 border-emerald-500/30 shadow-emerald-900/5"
          : "border-2 border-gold ring-4 ring-gold/20 gold-glow"
      }`}
    >
      {/* Top Banner Status */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="bg-olive/15 text-olive font-black text-xs px-3.5 py-1 rounded-full">
          المحاضرة #{session.order}
        </span>

        {isSolved ? (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>تم الحل ({session.userAttempt?.totalPoints} نقطة)</span>
          </span>
        ) : session.isUnlocked ? (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300 shadow-sm">
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
            <span>انتهت المحاضرة — الكويز متاح</span>
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>لم تنتهِ بعد</span>
          </span>
        )}
      </div>

      {/* Main Info */}
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-bold text-olive/80 block mb-1">
            {session.phaseName}
          </span>
          <h3 className="text-lg md:text-xl font-black text-olive-dark leading-snug">
            {session.title}
          </h3>
        </div>

        {/* Instructor Info Box */}
        <div className="flex items-center gap-3 bg-sand/50 p-3 rounded-2xl border border-olive/10">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold shrink-0 bg-white flex items-center justify-center">
            {session.instructor?.imagePath ? (
              <Image
                src={session.instructor.imagePath}
                alt={session.instructor.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-olive/60" />
            )}
          </div>
          <div className="text-right overflow-hidden">
            <p className="text-xs font-black text-olive-dark truncate">
              {session.instructor?.name || "القائد المحاضر"}
            </p>
            <p className="text-[10px] text-dark/60 truncate font-semibold">
              {session.instructor?.bio || "مدرب ومحاضر كشفي"}
            </p>
          </div>
        </div>

        <div className="text-xs text-dark/60 font-bold flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-olive" />
          <span>{session.day}</span>
        </div>
      </div>

      {/* Footer Actions / Solved Points Breakdown */}
      <div className="pt-4 mt-4 border-t border-sand-dark space-y-3">
        {isSolved && session.userAttempt ? (
          <div className="bg-sand/60 p-3 rounded-2xl border border-gold/20 text-xs space-y-1.5 font-bold">
            <div className="flex justify-between items-center text-dark">
              <span>النقاط الأساسية ({session.userAttempt.correctCount} صحيحة):</span>
              <span className="text-olive">{session.userAttempt.baseScore} نقطة</span>
            </div>
            {session.userAttempt.speedBonus > 0 && (
              <div className="flex justify-between items-center text-gold-dark">
                <span>⚡ بونص السرعة:</span>
                <span>+{session.userAttempt.speedBonus} نقطة</span>
              </div>
            )}
            {session.userAttempt.orderBonus > 0 && (
              <div className="flex justify-between items-center text-gold-dark">
                <span>🏆 بونص الأسبقية:</span>
                <span>+{session.userAttempt.orderBonus} نقطة</span>
              </div>
            )}
            <div className="flex justify-between items-center text-olive-dark pt-1 border-t border-olive/10 text-sm font-black">
              <span>المجموع الكلي:</span>
              <span className="text-gold font-black">{session.userAttempt.totalPoints} نقطة</span>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          {!isSolved && session.isUnlocked ? (
            session.questionCount > 0 ? (
              <Link
                href={`/session/${session.id}/quiz`}
                className="flex-1 py-3 px-4 bg-olive hover:bg-olive-dark text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>ابدأ كويز المحاضرة ({session.questionCount} أسئلة)</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={() => alert("هذه المحاضرة لا تحتوي على أسئلة أو كويز حالياً.")}
                className="flex-1 py-3 px-4 bg-gray-200/80 hover:bg-gray-200 text-gray-500 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-300/50 opacity-75"
              >
                <Sparkles className="w-4 h-4 text-gray-400 opacity-50" />
                <span>لا يوجد كويز لهذه المحاضرة 🚫</span>
              </button>
            )
          ) : !session.isUnlocked ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-gray-200 text-gray-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4 text-gray-400" />
              <span>في انتظار انتهاء المحاضرة لفتح الكويز ⏳</span>
            </button>
          ) : null}

          {session.isUnlocked && (
            <button
              onClick={() => onOpenFeedback(session.id, session.title)}
              title="إضافة تقييم سري"
              className="py-3 px-3 bg-gold/20 hover:bg-gold text-olive-dark hover:text-white rounded-2xl text-xs font-bold transition-all border border-gold/40 flex items-center justify-center gap-1 shrink-0 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span className="hidden sm:inline">تقييم سري</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
