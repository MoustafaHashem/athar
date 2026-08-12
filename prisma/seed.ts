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
    { name: "أشرف أنور", bio: "قائد ومحاضر متميز في التنمية البشرية وقيادة الذات والإرث الكشفي", imagePath: null },
    { name: "فاطمة الزهراء", bio: "متخصصة في إدارة الوقت والأولويات والتطوير المؤسسي", imagePath: "/images/instructors/fatma-alzahraa.jpg" },
    { name: "أحمد علي", bio: "خبير في بناء وتطوير مهارات القادة الشبان", imagePath: "/images/instructors/ahmed-ali.jpg" },
    { name: "وليد رمضان", bio: "مدرب متألق في ديناميكيات وديناميكية فرق العمل", imagePath: "/images/instructors/walid-ramadan.jpg" },
    { name: "مريم مانشي", bio: "متخصصة في التحفيز وإشعال الشغف وتوجيه الطاقات", imagePath: "/images/instructors/mariam-manshi.jpg" },
    { name: "أحمد بحري", bio: "مستشار التخطيط الاستراتيجي وصناعة الرؤية المستقبلية", imagePath: "/images/instructors/ahmed-bahri.jpg" },
    { name: "يوسف شوكت", bio: "باحث ومدرب في استراتيجيات الذكاءات المتعددة", imagePath: "/images/instructors/yousef-shawkat.jpg" },
    { name: "صلاح التوني", bio: "خبير حل المشكلات المعقدة واتخاذ القرارات الإستراتيجية", imagePath: "/images/instructors/salah-eltouni.jpg" },
    { name: "حمدي فتحي", bio: "مستشار إدارة المخاطر وتأهيل قادة المستقبل", imagePath: "/images/instructors/hamdi-fathi.jpg" },
    { name: "أحمد ماهر", bio: "متخصص في قيادة التغيير وإدارة المقاومة المؤسسية", imagePath: null },
  ];

  const instructorMap: Record<string, number> = {};

  for (const instData of instructorsData) {
    const existing = await prisma.instructor.findFirst({
      where: { name: instData.name },
    });
    if (existing) {
      instructorMap[instData.name] = existing.id;
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
      instructorName: "صلاح التوني",
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
      title: "صناعة قادة المستقبل",
      phaseName: "الإرث",
      day: "اليوم الثالث: السبت",
      instructorName: "حمدي فتحي",
    },
    {
      order: 14,
      title: "ترك الأثر وصناعة الإرث",
      phaseName: "الإرث",
      day: "اليوم الثالث: السبت",
      instructorName: "أشرف أنور",
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

    if (existingQuestionsCount === 0) {
      await prisma.question.createMany({
        data: [
          {
            sessionId: session.id,
            text: `ما الركيزة الأساسية لموضوع "${sessData.title}" في قيادة الجوالة؟`,
            optionA: "التواصل المستمر والوعي الذاتي",
            optionB: "الفردية في اتخاذ القرار",
            optionC: "تجاهل الأخطاء والتغاضي عنها",
            optionD: "الاعتماد الكامل على الآخرين",
            correctOption: "A",
          },
          {
            sessionId: session.id,
            text: `كيف يتعامل القائد الجوال الناجح خلال جلسة "${sessData.title}"؟`,
            optionA: "الإنصات الفعال وتشجيع روح الفريق",
            optionB: "الاستبداد برأيه فقط",
            optionC: "تأجيل المهام والتهرب من المسؤولية",
            optionD: "عدم الاهتمام بالأهداف",
            correctOption: "A",
          },
          {
            sessionId: session.id,
            text: `ما الأثر المستدام المتوقع بعد تطبيق مهارات "${sessData.title}"؟`,
            optionA: "صناعة بيئة إيجابية تترك أثراً مستداماً",
            optionB: "زيادة حدة الخلافات بين الأعضاء",
            optionC: "إحباط أفراد الفريق وتفادي التغيير",
            optionD: "تراجع أداء العشيرة",
            correctOption: "A",
          },
        ],
      });
    }
  }

  console.log("✅ تم إدخال الـ 14 جلسة والأسئلة التجريبية بنجاح!");
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
