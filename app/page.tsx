import Image from "next/image";
import Link from "next/link";
import { Compass, Footprints, Calendar, MapPin, Award, BookOpen, Flag, Sparkles, ArrowLeft, User, ShieldCheck, Users } from "lucide-react";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const studyLeadershipList = [
    {
      name: "أحمد مشعل",
      role: "قائد الدراسة",
      imagePath: null,
      badgeColor: "bg-gold text-olive-dark border-gold/40",
    },
    {
      name: "تسنيم أحمد",
      role: "قائدة الدراسة",
      imagePath: null,
      badgeColor: "bg-gold text-olive-dark border-gold/40",
    },
    {
      name: "مصطفى هاشم",
      role: "منفذ برامج",
      imagePath: "/images/team/mostafa-hashem.jpg",
      badgeColor: "bg-olive text-white border-olive/30",
    },
    {
      name: "مريم بحر",
      role: "منفذة برامج",
      imagePath: null,
      badgeColor: "bg-olive text-white border-olive/30",
    },
    {
      name: "نور خالد",
      role: "قائدة السكرتارية",
      imagePath: null,
      badgeColor: "bg-amber-600 text-white border-amber-500/30",
    },
    {
      name: "أحمد دراجون",
      role: "قائد الميديا",
      imagePath: null,
      badgeColor: "bg-blue-700 text-white border-blue-600/30",
    },
    {
      name: "جميلة توفيق",
      role: "مساعدة قائد الميديا",
      imagePath: null,
      badgeColor: "bg-blue-600 text-white border-blue-500/30",
    },
  ];

  const instructorsList = [
    {
      name: "ق. أشرف أنور",
      bio: "قائد ومحاضر متميز في التنمية البشرية وقيادة الذات والإرث الكشفي",
      imagePath: null,
      firstOrder: 1,
      sessions: ["المحاضرة #1", "المحاضرة #2", "المحاضرة #6", "المحاضرة #14"],
    },
    {
      name: "ق. فاطمة الزهراء",
      bio: "متخصصة في إدارة الوقت والأولويات والتطوير المؤسسي",
      imagePath: "/images/instructors/fatma-alzahraa.jpg",
      firstOrder: 3,
      sessions: ["المحاضرة #3"],
    },
    {
      name: "ق. أحمد علي",
      bio: "خبير في بناء وتطوير مهارات القادة الشبان",
      imagePath: "/images/instructors/ahmed-ali.jpg",
      firstOrder: 4,
      sessions: ["المحاضرة #4"],
    },
    {
      name: "ق. وليد رمضان",
      bio: "مدرب متألق في ديناميكيات وديناميكية فرق العمل",
      imagePath: "/images/instructors/walid-ramadan.jpg",
      firstOrder: 5,
      sessions: ["المحاضرة #5"],
    },
    {
      name: "ق. مريم مانشي",
      bio: "متخصصة في التحفيز وإشعال الشغف وتوجيه الطاقات",
      imagePath: "/images/instructors/mariam-manshi.jpg",
      firstOrder: 7,
      sessions: ["المحاضرة #7"],
    },
    {
      name: "ق. أحمد بحري",
      bio: "مستشار التخطيط الاستراتيجي وصناعة الرؤية المستقبلية",
      imagePath: "/images/instructors/ahmed-bahri.jpg",
      firstOrder: 8,
      sessions: ["المحاضرة #8"],
    },
    {
      name: "ق. يوسف شوكت",
      bio: "باحث ومدرب في استراتيجيات الذكاءات المتعددة",
      imagePath: "/images/instructors/yousef-shawkat.jpg",
      firstOrder: 9,
      sessions: ["المحاضرة #9"],
    },
    {
      name: "ق. صلاح التوني",
      bio: "خبير حل المشكلات المعقدة واتخاذ القرارات الإستراتيجية",
      imagePath: "/images/instructors/salah-eltouni.jpg",
      firstOrder: 10,
      sessions: ["المحاضرة #10"],
    },
    {
      name: "ق. حمدي فتحي",
      bio: "مستشار إدارة المخاطر وتأهيل قادة المستقبل",
      imagePath: "/images/instructors/hamdi-fathi.jpg",
      firstOrder: 11,
      sessions: ["المحاضرة #11", "المحاضرة #13"],
    },
    {
      name: "ق. أحمد ماهر",
      bio: "متخصص في قيادة التغيير وإدارة المقاومة المؤسسية",
      imagePath: null,
      firstOrder: 12,
      sessions: ["المحاضرة #12"],
    },
  ];

  const scheduleDays = [
    {
      dayTitle: "اليوم الأول: الخميس 13 أغسطس",
      phase: "المرحلة الأولى: قيادة الذات",
      items: [
        { time: "03:00 م - 03:30 م", title: "التجمع والحضور", instructor: "-", duration: "30 دقيقة" },
        { time: "03:30 م - 04:00 م", title: "طابور وتحية العلم", instructor: "-", duration: "30 دقيقة" },
        { time: "04:00 م - 04:20 م", title: "الجلسة التمهيدية: أهداف وأغراض الدراسة", instructor: "ق. أشرف أنور", duration: "20 دقيقة" },
        { time: "04:20 م - 05:10 م", title: "المحاضرة 1: اكتشاف الذات والوعي الداخلي", instructor: "ق. أشرف أنور", duration: "50 دقيقة" },
        { time: "05:10 م - 05:30 م", title: "استراحة (صلاة العصر)", instructor: "-", duration: "20 دقيقة" },
        { time: "05:30 م - 06:20 م", title: "المحاضرة 2: الذكاء العاطفي للقائد", instructor: "ق. أشرف أنور", duration: "50 دقيقة" },
        { time: "06:30 م - 07:20 م", title: "المحاضرة 3: إدارة الأولويات والوقت", instructor: "ق. فاطمة الزهراء", duration: "50 دقيقة" },
        { time: "07:30 م - 08:20 م", title: "المحاضرة 4: سمات القائد الناجح", instructor: "ق. أحمد علي", duration: "50 دقيقة" },
        { time: "08:20 م - 08:30 م", title: "استراحة (صلاة المغرب)", instructor: "-", duration: "10 دقائق" },
      ],
    },
    {
      dayTitle: "اليوم الثاني: الجمعة 14 أغسطس",
      phase: "المرحلة الثانية والثالثة: فرق العمل وقيادة الفريق",
      items: [
        { time: "09:00 ص - 09:30 ص", title: "التجمع والحضور", instructor: "-", duration: "30 دقيقة" },
        { time: "09:30 ص - 10:00 ص", title: "طابور وتحية العلم", instructor: "-", duration: "30 دقيقة" },
        { time: "10:00 ص - 11:35 ص", title: "المحاضرة 5: ديناميكيات تشكيل الفريق (جزء 1 و 2)", instructor: "ق. وليد رمضان", duration: "80 دقيقة" },
        { time: "11:50 ص - 12:40 م", title: "المحاضرة 6: التواصل الفعّال والعروض", instructor: "ق. أشرف أنور", duration: "50 دقيقة" },
        { time: "12:40 م - 02:30 م", title: "صلاة الجمعة وفترة الغداء", instructor: "-", duration: "110 دقيقة" },
        { time: "02:30 م - 03:20 م", title: "المحاضرة 7: التحفيز وإشعال الشغف", instructor: "ق. مريم مانشي", duration: "50 دقيقة" },
        { time: "03:35 م - 04:25 م", title: "المحاضرة 8: التخطيط وصناعة الرؤية", instructor: "ق. أحمد بحري", duration: "50 دقيقة" },
        { time: "04:25 م - 04:50 م", title: "استراحة (صلاة العصر)", instructor: "-", duration: "25 دقيقة" },
        { time: "04:50 م - 05:40 م", title: "المحاضرة 9: الذكاءات المتعددة", instructor: "ق. يوسف شوكت", duration: "50 دقيقة" },
        { time: "05:55 م - 06:45 م", title: "المحاضرة 10: حل المشكلات واتخاذ القرار", instructor: "ق. صلاح التوني", duration: "50 دقيقة" },
        { time: "06:45 م - 08:00 م", title: "حلقة السمر الكشفية", instructor: "-", duration: "75 دقيقة" },
      ],
    },
    {
      dayTitle: "اليوم الثالث: السبت 15 أغسطس",
      phase: "المرحلة الثالثة والرابعة: إدارة المخاطر والإرث",
      items: [
        { time: "09:00 ص - 09:30 ص", title: "التجمع والحضور", instructor: "-", duration: "30 دقيقة" },
        { time: "09:30 ص - 10:00 ص", title: "طابور وتحية العلم", instructor: "-", duration: "30 دقيقة" },
        { time: "10:00 ص - 10:50 ص", title: "المحاضرة 11: إدارة المخاطر", instructor: "ق. حمدي فتحي", duration: "50 دقيقة" },
        { time: "11:05 ص - 11:55 ص", title: "المحاضرة 12: قيادة التغيير وإدارة المقاومة", instructor: "ق. أحمد ماهر", duration: "50 دقيقة" },
        { time: "12:10 م - 01:00 م", title: "المحاضرة 13: صناعة قادة المستقبل", instructor: "ق. حمدي فتحي", duration: "50 دقيقة" },
        { time: "01:00 م - 02:00 م", title: "صلاة الظهر وفترة الغداء", instructor: "-", duration: "60 دقيقة" },
        { time: "02:00 م - 02:50 م", title: "المحاضرة 14: ترك الأثر وصناعة الإرث", instructor: "ق. أشرف أنور", duration: "50 دقيقة" },
        { time: "03:00 م - 05:30 م", title: "نشاط بحري وتجديف", instructor: "-", duration: "150 دقيقة" },
        { time: "05:30 م - 08:00 م", title: "حفل الختام وتسليم الأوسمة", instructor: "-", duration: "150 دقيقة" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sand">
      {/* Navbar Header */}
      <header className="olive-gradient text-white border-b-4 border-gold sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-gold overflow-hidden bg-white p-0.5 shadow">
              <Image
                src="/images/branding/logo.jpg"
                alt="لوجو أثر"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">منصة أثر</h1>
              <p className="text-xs text-gold font-bold">عشيرة جوالة كلية الهندسة — جامعة عين شمس</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="bg-gold hover:bg-gold-light text-olive-dark font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>دخول الجوالين</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with River / Mountains Theme */}
      <section className="relative olive-gradient text-white py-16 lg:py-24 px-4 overflow-hidden border-b-8 border-gold">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around items-center">
          <Compass className="w-96 h-96 text-gold animate-spin-slow" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-gold/40 shadow-inner">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs md:text-sm font-bold text-sand">
              برنامج إعداد القادة — 13 إلى 15 أغسطس 2026
            </span>
          </div>

          {/* Big Logo */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full border-4 border-gold p-1 bg-white shadow-2xl">
            <Image
              src="/images/branding/logo.jpg"
              alt="أثر"
              width={176}
              height={176}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            "القائد الحقيقي يصنع أثرًا"
          </h1>

          <p className="text-base md:text-xl text-sand/90 font-bold max-w-2xl mx-auto leading-relaxed">
            فيه نوعين من الناس... ناس تدخل أي مكان وتخرج منه زي ما دخلت، وناس تدخل مكان وتسيب فيه أثر يفضل موجود!
          </p>

          {/* Call to Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-olive-dark font-black rounded-2xl text-base shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>دخول منصة الكويزات والنقاط</span>
            </Link>
          </div>

          {/* Quick info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 max-w-2xl mx-auto text-right">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <Calendar className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-extrabold text-sm text-white">تاريخ الحدث</h3>
              <p className="text-xs text-sand/80 font-semibold">الخميس والجمعة والسبت (13-15 أغسطس)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <MapPin className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-extrabold text-sm text-white">مقر الدراسة</h3>
              <p className="text-xs text-sand/80 font-semibold">نادي الكشافة البحرية بالقاهرة (حارس)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footprints Divider */}
      <div className="py-6 bg-sand flex justify-center items-center gap-4 text-olive/40">
        <Footprints className="w-6 h-6 transform -rotate-45" />
        <span className="w-16 h-0.5 bg-olive/20"></span>
        <Footprints className="w-6 h-6 transform rotate-45" />
        <span className="w-16 h-0.5 bg-olive/20"></span>
        <Footprints className="w-6 h-6 transform -rotate-12" />
      </div>

      {/* Program Content Overview */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="bg-olive/10 text-olive text-xs font-black px-4 py-1.5 rounded-full">
            المراحل الأربعة للدراسة
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-olive-dark">
            في "أثر" هتتعلم ازاي: تقود نفسك، تبني فريق، وتترك أثراً حقيقياً
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-olive/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="font-extrabold text-lg text-olive-dark">قيادة الذات</h3>
            <p className="text-xs text-dark/70 font-semibold leading-relaxed">
              اكتشاف الذات والوعي الداخلي، الذكاء العاطفي، إدارة الوقت والأولويات، وسمات القائد الناجح.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-olive/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="font-extrabold text-lg text-olive-dark">فرق العمل</h3>
            <p className="text-xs text-dark/70 font-semibold leading-relaxed">
              ديناميكيات تشكيل الفريق، مهارات التواصل الفعّال والعروض، والتحفيز وإشعال الشغف.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-olive/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="font-extrabold text-lg text-olive-dark">قيادة الفريق</h3>
            <p className="text-xs text-dark/70 font-semibold leading-relaxed">
              التخطيط وصناعة الرؤية، الذكاءات المتعددة، حل المشكلات واتخاذ القرار، وإدارة المخاطر.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-olive/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center font-black text-xl">
              4
            </div>
            <h3 className="font-extrabold text-lg text-olive-dark">الإرث والأثر</h3>
            <p className="text-xs text-dark/70 font-semibold leading-relaxed">
              قيادة التغيير وإدارة المقاومة، صناعة قادة المستقبل، وترك الأثر والصناعة الدائمة للإرث.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Table Section */}
      <section className="py-12 bg-white border-y border-olive/10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-gold/20 text-gold-dark text-xs font-black px-4 py-1.5 rounded-full">
              البرنامج الشامل 14 محاضرة
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-olive-dark">
              جدول برنامج إعداد القادة اليومي
            </h2>
          </div>

          <div className="space-y-8">
            {scheduleDays.map((day, idx) => (
              <div key={idx} className="bg-sand/40 rounded-3xl p-6 border border-olive/15 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-olive/15 pb-3 gap-2">
                  <h3 className="font-black text-lg text-olive-dark flex items-center gap-2">
                    <Flag className="w-5 h-5 text-gold" />
                    <span>{day.dayTitle}</span>
                  </h3>
                  <span className="text-xs font-extrabold text-olive bg-white px-3 py-1 rounded-full border border-olive/10 w-fit">
                    {day.phase}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-olive/10 text-olive-dark font-extrabold">
                        <th className="py-2.5 px-3 rounded-r-xl">الوقت</th>
                        <th className="py-2.5 px-3">الجلسة / المحور</th>
                        <th className="py-2.5 px-3">القائد المحاضر</th>
                        <th className="py-2.5 px-3 rounded-l-xl">المدة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-olive/10">
                      {day.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="hover:bg-white/60 font-semibold">
                          <td className="py-2.5 px-3 font-bold text-olive">{item.time}</td>
                          <td className="py-2.5 px-3 font-extrabold text-dark">{item.title}</td>
                          <td className="py-2.5 px-3 text-olive-dark">{item.instructor}</td>
                          <td className="py-2.5 px-3 text-dark/60">{item.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold-dark text-xs font-black px-4 py-1.5 rounded-full border border-gold/40">
            <Award className="w-4 h-4 text-gold-dark" />
            <span>نخبة القادة والمحاضرين</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-olive-dark">
            قادة ومحاضرو برنامج "أثر"
          </h2>
          <div className="inline-block bg-white px-4 py-2 rounded-2xl border border-olive/15 shadow-sm text-xs md:text-sm font-extrabold text-olive">
            💡 <strong>تنبيه تنظيم القائمة:</strong> تم ترتيب أسبقية ظهور القادة أدناه بناءً على ترتيب ظهورهم الأول في المحاضرات (من المحاضرة #1 إلى المحاضرة #14)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {instructorsList.map((inst, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-olive/15 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-center relative overflow-hidden group"
            >
              <div className="absolute top-3 right-3 bg-olive/10 text-olive text-[11px] font-black px-2.5 py-0.5 rounded-full">
                #{idx + 1}
              </div>

              <div className="space-y-4 pt-2">
                {/* Image */}
                <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-gold p-1 bg-white shadow-md group-hover:scale-105 transition-transform">
                  {inst.imagePath ? (
                    <Image
                      src={inst.imagePath}
                      alt={inst.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-sand flex items-center justify-center text-olive">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Name & Bio */}
                <div className="space-y-1.5">
                  <h3 className="font-black text-base text-olive-dark">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-dark/70 font-semibold leading-relaxed min-h-[40px]">
                    {inst.bio}
                  </p>
                </div>
              </div>

              {/* Presented Sessions Badges */}
              <div className="pt-4 mt-4 border-t border-sand-dark space-y-1.5">
                <span className="text-[10px] font-extrabold text-olive/70 block">
                  المحاضرات المقدمة:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {inst.sessions.map((sessBadge, bIdx) => (
                    <span
                      key={bIdx}
                      className="bg-gold/15 text-olive-dark border border-gold/30 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    >
                      {sessBadge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study Leadership Team Section */}
      <section className="py-16 bg-white border-t border-olive/10 px-4">
        <div className="max-w-7xl mx-auto w-full space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-olive/10 text-olive text-xs font-black px-4 py-1.5 rounded-full border border-olive/20">
              <Users className="w-4 h-4 text-olive" />
              <span>هيكل قيادة وتنظيم الدراسة</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-olive-dark">
              فريق قيادة وتنظيم برنامج "أثر"
            </h2>
            <p className="text-xs md:text-sm text-dark/70 font-semibold">
              قيادة عشيرة الجوالة واللجان التنظيمية القائمة على إعداد وتجهيز دراسة إعداد القادة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {studyLeadershipList.map((member, idx) => (
              <div
                key={idx}
                className="bg-sand/30 rounded-3xl p-6 border border-olive/15 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 relative overflow-hidden group"
              >
                {/* Image */}
                <div className="relative w-28 h-28 mx-auto rounded-full border-4 border-gold p-1 bg-white shadow-lg group-hover:scale-105 transition-transform">
                  {member.imagePath ? (
                    <Image
                      src={member.imagePath}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-olive/10 flex items-center justify-center text-olive">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-olive-dark">
                    {member.name}
                  </h3>
                  <div className="inline-block">
                    <span className={`text-xs font-black px-3.5 py-1 rounded-full border shadow-sm ${member.badgeColor}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
