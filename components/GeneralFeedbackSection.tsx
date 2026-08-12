"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Send,
  CheckCircle2,
  Users,
  Award,
  Camera,
  Utensils,
  Sparkles,
  MessageSquareHeart,
  UserCheck
} from "lucide-react";

const TEAM_MEMBERS = [
  { name: "أحمد مشعل", role: "قائد الدراسة", imagePath: "/images/team/ahmed-meshal.jpg" },
  { name: "تسنيم أحمد", role: "مساعدة قائد الدراسة", imagePath: "/images/team/tasneem-ahmed.jpg" },
  { name: "مصطفى هاشم", role: "منفذ برامج", imagePath: "/images/team/mostafa-hashem.jpg" },
  { name: "مريم بحر", role: "منفذة برامج", imagePath: "/images/team/mariam-bahr.jpg" },
  { name: "نور خالد", role: "قائدة السكرتارية", imagePath: "/images/team/nour-khaled.jpg" },
  { name: "أحمد دراجون", role: "قائد الميديا", imagePath: "/images/team/ahmed-dragon.jpg" },
  { name: "جميلة توفيق", role: "مساعدة قائد الميديا", imagePath: "/images/team/gamila-tawfik.jpg" },
  { name: "محمود هشام", role: "قائد السواعد", imagePath: "/images/team/mahmoud-hisham.jpg" },
];

const INSTRUCTORS = [
  { name: "ق. أشرف أنور", role: "قائد مكتب تدريب جوالة هندسة عين شمس", imagePath: "/images/instructors/ashraf-anwar.png" },
  { name: "ق. فاطمة الزهراء", role: "مكتب تدريب الهندسة", imagePath: "/images/instructors/fatma-alzahraa.jpg" },
  { name: "ق. أحمد علي", role: "عضو مكتب التدريب", imagePath: "/images/instructors/ahmed-ali.jpg" },
  { name: "ق. وليد رمضان", role: "استشاري إدارة المشروعات", imagePath: "/images/instructors/walid-ramadan.jpg" },
  { name: "ق. مريم مانشي", role: "مهندسة طاقة متجددة", imagePath: "/images/instructors/mariam-manshi.jpg" },
  { name: "ق. أحمد بحري", role: "الكشافة البحرية المصرية", imagePath: "/images/instructors/ahmed-bahri.jpg" },
  { name: "ق. يوسف شوكت", role: "مفوض بحرية القاهرة", imagePath: "/images/instructors/yousef-shawkat.jpg" },
  { name: "ق. حمدي فتحي", role: "مدير عام البنك الأهلي", imagePath: "/images/instructors/hamdi-fathi.jpg" },
  { name: "ق. أحمد ماهر", role: "قيادة التغيير والمقاومة", imagePath: "/images/instructors/ahmed-maher.jpg" },
  { name: "ق. صلاح التوني", role: "مدير مشروعات وقائد سابق", imagePath: "/images/instructors/salah-eltouni.jpg" },
];

export default function GeneralFeedbackSection() {
  const [activeCategory, setActiveCategory] = useState<"PROGRAM" | "TEAM_MEMBER" | "INSTRUCTOR" | "MEDIA" | "CATERING">("PROGRAM");
  
  // Selected Target for Individual Reviews
  const [selectedTeamMember, setSelectedTeamMember] = useState(TEAM_MEMBERS[0].name);
  const [selectedInstructor, setSelectedInstructor] = useState(INSTRUCTORS[0].name);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    let targetName: string | null = null;
    if (activeCategory === "TEAM_MEMBER") targetName = selectedTeamMember;
    if (activeCategory === "INSTRUCTOR") targetName = selectedInstructor;

    try {
      const res = await fetch("/api/general-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          targetName,
          rating,
          reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء إرسال التقييم");
      } else {
        setSuccessMsg("تم إرسال تقييمك بنجاح وسريّة تامة 🔒! شكرًا لمساهمتك.");
        setReviewText("");
        setRating(5);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-olive/15 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-dark pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-gold/20 text-gold-dark text-xs font-black px-3 py-1 rounded-full mb-2">
            <MessageSquareHeart className="w-4 h-4 text-gold-dark" />
            <span>صندوق التقييمات العامة والسرية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-olive-dark">
            شارَكنا رأيك السري في كافة جوانب دراسة "أثر" 🔒
          </h2>
          <p className="text-xs text-dark/70 font-semibold mt-1">
            جميع الإجابات مجردة ومجهولة الهوية تماماً بدون تسجيل أي بيانات شخصية.
          </p>
        </div>
      </div>

      {/* Categories Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-sand/40 p-2 rounded-2xl border border-olive/10">
        <button
          type="button"
          onClick={() => { setActiveCategory("PROGRAM"); setRating(5); setReviewText(""); setSuccessMsg(""); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === "PROGRAM"
              ? "bg-olive text-white shadow-md"
              : "text-olive hover:bg-white/60"
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span>البرنامج العام</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("TEAM_MEMBER"); setRating(5); setReviewText(""); setSuccessMsg(""); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === "TEAM_MEMBER"
              ? "bg-olive text-white shadow-md"
              : "text-olive hover:bg-white/60"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>هيكل القيادة والتنظيم</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("INSTRUCTOR"); setRating(5); setReviewText(""); setSuccessMsg(""); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === "INSTRUCTOR"
              ? "bg-olive text-white shadow-md"
              : "text-olive hover:bg-white/60"
          }`}
        >
          <Award className="w-4 h-4 text-gold" />
          <span>القادة والمحاضرين</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("MEDIA"); setRating(5); setReviewText(""); setSuccessMsg(""); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === "MEDIA"
              ? "bg-olive text-white shadow-md"
              : "text-olive hover:bg-white/60"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>تغطية الميديا</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("CATERING"); setRating(5); setReviewText(""); setSuccessMsg(""); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === "CATERING"
              ? "bg-olive text-white shadow-md"
              : "text-olive hover:bg-white/60"
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>التغذية والإعاشة</span>
        </button>
      </div>

      {/* Active Category Content & Form */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Category Description Banner */}
        <div className="bg-sand/60 p-4 rounded-2xl border border-olive/10 space-y-1">
          <h3 className="font-extrabold text-sm text-olive-dark flex items-center gap-2">
            {activeCategory === "PROGRAM" && "🌟 تقييم دراسة إعداد القادة بوجه عام"}
            {activeCategory === "TEAM_MEMBER" && "👔 تقييم أعضاء هيكل القيادة والتنظيم"}
            {activeCategory === "INSTRUCTOR" && "🎙️ تقييم السادة القادة والمحاضرين"}
            {activeCategory === "MEDIA" && "📸 تقييم التغطية الإعلامية وفريق الميديا والتصوير"}
            {activeCategory === "CATERING" && "🍱 تقييم التغذية ومواعيد جودة الوجبات"}
          </h3>
          <p className="text-xs text-dark/70 font-semibold">
            {activeCategory === "PROGRAM" && "ما هو انطباعك العام عن محتوى الدراسة والبرنامج الكشفي والتنظيمي؟"}
            {activeCategory === "TEAM_MEMBER" && "اختر الفرد المطلوب تقييمه من الهيكل واكتب تقييمك له بكل حرية وشفافية."}
            {activeCategory === "INSTRUCTOR" && "اختر المحاضر المطلوب تقييمه واكتب انطباعك حول أسلوبه وتفاعله."}
            {activeCategory === "MEDIA" && "ما رأيك في التغطية الفوغرافية، التوثيق، وجودة الصور والفيديوهات المنتجة؟"}
            {activeCategory === "CATERING" && "هل كانت الوجبات تصل في مواعيدها المحددة وهل كانت بجودة مناسبة للمشاركين؟"}
          </p>
        </div>

        {/* Target Selection Grid for TEAM_MEMBER */}
        {activeCategory === "TEAM_MEMBER" && (
          <div className="space-y-2">
            <label className="block text-xs font-black text-olive">
              اختر الشخص المراد تقييمه من فريق القيادة والتنظيم:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.name}
                  type="button"
                  onClick={() => setSelectedTeamMember(member.name)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedTeamMember === member.name
                      ? "bg-olive text-white border-olive shadow-md ring-2 ring-gold/40"
                      : "bg-white text-dark border-olive/15 hover:bg-sand/50"
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gold bg-sand">
                    <Image src={member.imagePath} alt={member.name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate">{member.name}</p>
                    <p className={`text-[10px] truncate ${selectedTeamMember === member.name ? "text-gold" : "text-dark/60"}`}>
                      {member.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Target Selection Grid for INSTRUCTOR */}
        {activeCategory === "INSTRUCTOR" && (
          <div className="space-y-2">
            <label className="block text-xs font-black text-olive">
              اختر المحاضر المراد تقييمه:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {INSTRUCTORS.map((inst) => (
                <button
                  key={inst.name}
                  type="button"
                  onClick={() => setSelectedInstructor(inst.name)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedInstructor === inst.name
                      ? "bg-olive text-white border-olive shadow-md ring-2 ring-gold/40"
                      : "bg-white text-dark border-olive/15 hover:bg-sand/50"
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gold bg-sand">
                    <Image src={inst.imagePath} alt={inst.name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate">{inst.name}</p>
                    <p className={`text-[10px] truncate ${selectedInstructor === inst.name ? "text-gold" : "text-dark/60"}`}>
                      {inst.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive 5-Star Rating Control */}
        <div className="bg-sand/30 p-4 rounded-2xl border border-olive/15 space-y-2">
          <label className="block text-xs font-black text-olive">
            التقييم العام بالنجوم (من 1 إلى 5 نجوم):
          </label>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 dir-ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-gold fill-gold drop-shadow-sm"
                        : "text-gray-300 fill-gray-100"
                    }`}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs font-black text-olive bg-white px-3.5 py-1.5 rounded-xl border border-olive/15 shadow-sm">
              {rating === 1 && "⭐ ضعيف (1/5)"}
              {rating === 2 && "⭐⭐ مقبول (2/5)"}
              {rating === 3 && "⭐⭐⭐ جيد (3/5)"}
              {rating === 4 && "⭐⭐⭐⭐ جيد جداً (4/5)"}
              {rating === 5 && "⭐⭐⭐⭐⭐ ممتاز (5/5)"}
            </span>
          </div>
        </div>

        {/* Textarea for Notes & Comments */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-olive">
            {activeCategory === "PROGRAM" && "أبرز الملاحظات أو الاقتراحات لتطوير دراسة إعداد القادة:"}
            {activeCategory === "TEAM_MEMBER" && `اكتب رأيك وملاحظاتك حول أداء وتعامل (${selectedTeamMember}):`}
            {activeCategory === "INSTRUCTOR" && `اكتب انطباعك وملاحظاتك حول أداء وقدرة (${selectedInstructor}):`}
            {activeCategory === "MEDIA" && "ما رأيك في تغطية الميديا واقتراحاتك لتحسين الصور والمحتوى؟"}
            {activeCategory === "CATERING" && "هل كان الأكل يصل في مواعيده؟ وما رأيك في الوجبات والتنظيم؟"}
          </label>
          <textarea
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="اكتب ملاحظاتك بكل صراحة وحرية هنا... الإجابة سرية 100%"
            className="w-full p-3.5 bg-sand/30 border border-olive/20 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
          ></textarea>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-olive hover:bg-olive-dark text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-gold" />
            <span>{submitting ? "جاري الحفظ والتحفيظ..." : "إرسال التقييم السري 🔒"}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
