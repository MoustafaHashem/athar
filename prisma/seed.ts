import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إدخال البيانات التلقائية في قاعدة البيانات...");

  // 1. إنشاء الحساب الأدمن الافتراضي
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin123", // كلمة مرور الأدمن الافتراضية
      role: "ADMIN",
    },
  });
  console.log("✅ تم إنشاء حساب الأدمن الافتراضي:", admin.username);

  // 2. إدخال المحاضرين (10 محاضرين)
  const instructorsData = [
    { name: "أشرف أنور", bio: "مدير عام المعلومات وقواعد البيانات بشركة جابكو للبترول - قائد ومحاضر متميز في التنمية البشرية وقيادة الذات والإرث الكشفي - عضو مكتب تدريب جامعة عين شمس - قائد مكتب تدريب جوالة هندسة عين شمس - قائد عشائر جامعة عين شمس سابقاً", imagePath: "/images/instructors/ashraf-anwar.png" },
    { name: "فاطمة الزهراء", bio: "Senior Sustainability Engineer - متخصصة في إدارة الوقت والأولويات والتطوير المؤسسي - عضو مكتب تدريب هندسة عين شمس", imagePath: "/images/instructors/fatma-alzahraa.jpg" },
    { name: "أحمد علي", bio: "المدير الإقليمي بشركة فيرتيميد انترناشونال - خبير في بناء وتطوير مهارات القادة الشبان - عضو مكتب تدريب الجامعة - قائد منتخب الجامعة سابقاً", imagePath: "/images/instructors/ahmed-ali.jpg" },
    { name: "وليد رمضان", bio: "محاضر دولي (PMP, PRMG) واستشاري إدارة المشروعات - مدرب متألق في ديناميكيات فرق العمل - قائد سابق لعشيرة جوالة هندسة عين شمس", imagePath: "/images/instructors/walid-ramadan.jpg" },
    { name: "مريم مانشي", bio: "مهندسة طاقة متجددة - متخصصة في التحفيز وإشعال الشغف وتوجيه الطاقات - رائدة كبرى سابقاً بعشيرة الجوالة", imagePath: "/images/instructors/mariam-manshi.jpg" },
    { name: "أحمد بحري", bio: "المستشار القانوني لبحرية القاهرة - مستشار التخطيط الاستراتيجي وصناعة الرؤية المستقبلية - مساعد كبير مفوضي الكشافة البحرية المصرية - عضو مكتب تدريب جامعة عين شمس", imagePath: "/images/instructors/ahmed-bahri.jpg" },
    { name: "يوسف شوكت", bio: "Technical Office Team Leader | Civil Engineer - مفوض مرحلة الجوالة ببحرية القاهرة - قائد عشاير جامعة عين شمس سابقا - قائد عشيرة هندسة سابقا - عضو مكتب تدريب عشيرة جوالة هندسة عين شمس - عضو مكتب تدريب عشيرة جوالة جامعة عين شمس", imagePath: "/images/instructors/yousef-shawkat.jpg" },
    { name: "حمدي فتحي", bio: "مدير عام بالبنك الأهلي المصري - مستشار إدارة المخاطر وتأهيل قادة المستقبل - قائد سابق لعشيرة الجوالة", imagePath: "/images/instructors/hamdi-fathi.jpg" },
    { name: "أحمد ماهر", bio: "مدير مشاريع - متخصص في قيادة التغيير وإدارة المقاومة المؤسسية - رئيس لجنة المنح والشراكات بالاتحاد العام للكشافة والمرشدات", imagePath: "/images/instructors/ahmed-maher.jpg" },
    { name: "صلاح التوني", bio: "مدير مشروعات - خبير حل المشكلات المعقدة واتخاذ القرارات الاستراتيجية - قائد سابق لعشيرة جوالة هندسة عين شمس", imagePath: "/images/instructors/salah-eltouni.jpg" },
  ];

  const instructorMap: Record<string, number> = {};

  for (const instData of instructorsData) {
    const existing = await prisma.instructor.findFirst({
      where: { name: instData.name },
    });
    if (existing) {
      const updated = await prisma.instructor.update({
        where: { id: existing.id },
        data: instData,
      });
      instructorMap[instData.name] = updated.id;
    } else {
      const created = await prisma.instructor.create({
        data: instData,
      });
      instructorMap[instData.name] = created.id;
    }
  }
  console.log("✅ تم تجهيز بيانات المحاضرين (10 المحاضرين)");

  // 3. إدخال الجلسات الـ 14 بالترتيب
  const sessionsData = [
    {
      order: 1,
      title: "اكتشاف الذات والوعي الداخلي",
      phaseName: "قيادة الذات",
      day: "اليوم الأول: الخميس",
      instructorName: "أشرف أنور",
    },
    {
      order: 2,
      title: "الذكاء العاطفي للقائد",
      phaseName: "قيادة الذات",
      day: "اليوم الأول: الخميس",
      instructorName: "أشرف أنور",
    },
    {
      order: 3,
      title: "إدارة الأولويات والوقت",
      phaseName: "قيادة الذات",
      day: "اليوم الأول: الخميس",
      instructorName: "فاطمة الزهراء",
    },
    {
      order: 4,
      title: "سمات القائد الناجح",
      phaseName: "قيادة الذات",
      day: "اليوم الأول: الخميس",
      instructorName: "أحمد علي",
    },
    {
      order: 5,
      title: "ديناميكيات تشكيل الفريق",
      phaseName: "فرق العمل",
      day: "اليوم الثاني: الجمعة",
      instructorName: "وليد رمضان",
    },
    {
      order: 6,
      title: "التواصل الفعّال والعروض",
      phaseName: "فرق العمل",
      day: "اليوم الثاني: الجمعة",
      instructorName: "أشرف أنور",
    },
    {
      order: 7,
      title: "التحفيز وإشعال الشغف",
      phaseName: "فرق العمل",
      day: "اليوم الثاني: الجمعة",
      instructorName: "مريم مانشي",
    },
    {
      order: 8,
      title: "التخطيط وصناعة الرؤية",
      phaseName: "قيادة الفريق",
      day: "اليوم الثاني: الجمعة",
      instructorName: "أحمد بحري",
    },
    {
      order: 9,
      title: "الذكاءات المتعددة",
      phaseName: "قيادة الفريق",
      day: "اليوم الثاني: الجمعة",
      instructorName: "يوسف شوكت",
    },
    {
      order: 10,
      title: "حل المشكلات واتخاذ القرار",
      phaseName: "قيادة الفريق",
      day: "اليوم الثاني: الجمعة",
      instructorName: "أشرف أنور",
    },
    {
      order: 11,
      title: "إدارة المخاطر",
      phaseName: "قيادة الفريق",
      day: "اليوم الثالث: السبت",
      instructorName: "حمدي فتحي",
    },
    {
      order: 12,
      title: "قيادة التغيير وإدارة المقاومة",
      phaseName: "قيادة الفريق",
      day: "اليوم الثالث: السبت",
      instructorName: "أحمد ماهر",
    },
    {
      order: 13,
      title: "التفويض والتمكين والتوجيه والكوتشينج",
      phaseName: "الإرث",
      day: "اليوم الثالث: السبت",
      instructorName: "حمدي فتحي",
    },
    {
      order: 14,
      title: "ترك الأثر وصناعة الإرث",
      phaseName: "الإرث",
      day: "اليوم الثالث: السبت",
      instructorName: "صلاح التوني",
    },
  ];

  for (const sessData of sessionsData) {
    const instructorId = instructorMap[sessData.instructorName] || null;
    const session = await prisma.session.upsert({
      where: { order: sessData.order },
      update: {
        title: sessData.title,
        phaseName: sessData.phaseName,
        day: sessData.day,
        instructorId,
      },
      create: {
        order: sessData.order,
        title: sessData.title,
        phaseName: sessData.phaseName,
        day: sessData.day,
        instructorId,
        isUnlocked: false,
      },
    });

    // 4. إضافة أسئلة تجريبية لكل جلسة (تنبيه: يجب استبدالها بالأسئلة الحقيقية قبل الحدث)
    const existingQuestionsCount = await prisma.question.count({
      where: { sessionId: session.id },
    });

  }

  console.log("✅ تم إدخال الـ 14 جلسة والمحاضرين بنجاح!");
  console.log("🎉 اكتمل عملية الـ Seed بنجاح!");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في عملية الـ Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
