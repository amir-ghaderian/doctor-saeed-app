"use client";

import Link from "next/link";
import { Lalezar, Vazirmatn } from "next/font/google";
import { motion } from "framer-motion";

const displayFont = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "swap",
});

const pillars = [
  {
    number: "۰۱",
    title: "خودشناسی",
    text: "شناخت نقاط قوت، ضعف، ارزش‌ها، علایق و اهداف.",
  },
  {
    number: "۰۲",
    title: "هدف‌گذاری",
    text: "تبدیل خواسته‌ها به اهداف مشخص، قابل‌اندازه‌گیری و زمان‌بندی‌شده.",
  },
  {
    number: "۰۳",
    title: "یادگیری مستمر",
    text: "مطالعه، آموزش، تجربه و یادگیری مهارت‌های جدید.",
  },
  {
    number: "۰۴",
    title: "انضباط و استمرار",
    text: "انجام کارهای درست حتی زمانی که انگیزه کافی نداریم.",
  },
  {
    number: "۰۵",
    title: "هوش هیجانی",
    text: "شناخت و مدیریت احساسات و ایجاد ارتباط بهتر با دیگران.",
  },
  {
    number: "۰۶",
    title: "سلامت جسم و روان",
    text: "خواب مناسب، فعالیت بدنی، تغذیه متعادل و مراقبت از ذهن.",
  },
  {
    number: "۰۷",
    title: "بازنگری و رشد",
    text: "بررسی عملکرد خود، یادگیری از اشتباهات و اصلاح مسیر.",
  },
] as const;

const dailyQuestions = [
  "امروز چه چیزی یاد گرفتم؟",
  "امروز چه کاری را بهتر از دیروز انجام دادم؟",
  "فردا برای رشد خودم چه قدمی برمی‌دارم؟",
] as const;

const principles = [
  {
    number: "۰۱",
    slug: "mez-ra-bichin",
    title: "میز را بچین",
    description:
      "قبل از شروع، دقیقاً مشخص کن چه هدفی داری و قرار است به چه نتیجه‌ای برسی.",
  },
  {
    number: "۰۲",
    slug: "barname-rizi-roozane",
    title: "برای هر روز از روز قبل برنامه‌ریزی کن",
    description:
      "کارهای روز بعد را از قبل یادداشت کن و مشخص کن اول چه کاری باید انجام شود؛ اولویت‌بندی را بر اساس اهمیت انجام بده.",
  },
  {
    number: "۰۳",
    slug: "ghanoon-80-20",
    title: "قانون ۸۰/۲۰ را اجرا کن",
    description:
      "همه کارها ارزش یکسان ندارند؛ معمولاً بیست درصد کارها هشتاد درصد نتایج را ایجاد می‌کنند.",
  },
  {
    number: "۰۴",
    slug: "natayej-va-avaqeb",
    title: "پیامدها را در نظر بگیر",
    description:
      "کارهایی را در اولویت قرار بده که انجام دادن یا ندادنشان تأثیر بیشتری بر آینده‌ات دارد.",
  },
  {
    number: "۰۵",
    slug: "abcde",
    title: "روش ABCDE را به کار ببر",
    description:
      "کارها را بر اساس اهمیت و هدف مشخصی که داری دسته‌بندی کن.",
    detail: [
      "A: ضروری و مهم",
      "B: مهم ولی با ضرورت کمتر",
      "C: بهتر است انجام شود",
      "D: قابل واگذاری",
      "E: قابل حذف",
    ],
  },
  {
    number: "۰۶",
    slug: "natayej-kelidi",
    title: "روی حوزه‌های کلیدی تمرکز کن",
    description:
      "بررسی کن در کار یا زندگی‌ات چه فعالیت‌هایی مستقیماً نتیجه اصلی را ایجاد می‌کنند و روی همان‌ها تمرکز کن.",
  },
  {
    number: "۰۷",
    slug: "ghanoon-zoroorat",
    title: "قانون بهره‌وری اجباری",
    description:
      "اگر می‌خواهی کاری انجام شود، برایش زمان مشخص و غیرقابل‌تغییر تعیین کن.",
  },
  {
    number: "۰۸",
    slug: "amadegi",
    title: "قبل از شروع کاملاً آماده شو",
    description:
      "ابزار، اطلاعات و محیط موردنیاز را آماده کن تا هنگام شروع، بهانه‌ای برای متوقف شدن نداشته باشی.",
  },
  {
    number: "۰۹",
    slug: "moqaddamat-kar",
    title: "تکلیف اصلی را بشناس",
    description:
      "از خودت بپرس: «مهم‌ترین کاری که الان باید انجام بدهم چیست؟»",
  },
  {
    number: "۱۰",
    slug: "estehdad-haye-khas",
    title: "یک بشکه را هر بار خالی کن",
    description:
      "کارها را نیمه‌کاره رها نکن؛ تا حد امکان یک کار را به اتمام برسان و بعد سراغ کار بعدی برو.",
  },
  {
    number: "۱۱",
    slug: "mahdoodiat-asli",
    title: "مهارت‌های کلیدی خودت را ارتقا بده",
    description:
      "در مهارت‌هایی که بیشترین تأثیر را روی موفقیتت دارند، به‌طور مداوم تلاش کن تا مسلط‌تر شوی.",
  },
  {
    number: "۱۲",
    slug: "ghadam-be-ghadam",
    title: "محدودیت اصلی را پیدا کن",
    description:
      "مشخص کن بزرگ‌ترین مانع بین تو و هدفت چیست و ابتدا همان را برطرف کن.",
  },
  {
    number: "۱۳",
    slug: "feshar-bar-khod",
    title: "به خودت فشار مثبت وارد کن",
    description:
      "منتظر انگیزه نمان؛ خودت را به شروع و ادامه کار متعهد کن.",
  },
  {
    number: "۱۴",
    slug: "niro-va-tavan",
    title: "قدرت شخصی‌ات را افزایش بده",
    description:
      "انرژی جسمی و ذهنی‌ات را مدیریت کن؛ خستگی، خواب و سلامت مستقیماً روی بهره‌وری اثر دارند.",
  },
  {
    number: "۱۵",
    slug: "angizeh",
    title: "خودت را به اقدام فوری عادت بده",
    description:
      "وقتی تصمیم گرفتی کاری را انجام دهی، شروعش را عقب نینداز.",
  },
  {
    number: "۱۶",
    slug: "tanbali-khalagh",
    title: "تعلل سازنده داشته باش",
    description:
      "لازم نیست همه کارها را انجام دهی؛ کارهای کم‌اهمیت را آگاهانه به تعویق بینداز یا بنا بر درجه اهمیت حذف کن.",
  },
  {
    number: "۱۷",
    slug: "sakht-tarin-kar",
    title: "اول از سخت‌ترین کارها شروع کن",
    description:
      "سخت‌ترین و مهم‌ترین کار روز را قبل از کارهای آسان و لذت‌بخش انجام بده؛ این همان اصل مرکزی کتاب است.",
  },
  {
    number: "۱۸",
    slug: "taghsim-kar",
    title: "کار را به بخش‌های کوچک‌تر تقسیم کن",
    description:
      "اگر کاری بزرگ و ترسناک است، آن را به قدم‌های کوچک و قابل انجام تبدیل کن و از اولین قدم شروع کن.",
  },
  {
    number: "۱۹",
    slug: "zaman-bi-vaghfe",
    title: "زمان‌های بزرگ و بدون وقفه ایجاد کن",
    description:
      "برای کارهای مهم، زمان‌هایی را در نظر بگیر که تلفن، پیام‌ها و حواس‌پرتی‌ها حذف شوند.",
  },
  {
    number: "۲۰",
    slug: "hes-foriyat",
    title: "حس فوریت ایجاد کن",
    description:
      "با خودت طوری رفتار کن که گویی انجام کار مهم است و نباید منتظر شرایط ایده‌آل بمانی.",
  },
  {
    number: "۲۱",
    slug: "tamarkoz-yek-kar",
    title: "یک کار را تا پایان انجام بده",
    description:
      "وقتی شروع کردی، تمام توجهت را روی همان کار بگذار؛ تمرکز کامل یکی از مهم‌ترین عوامل بهره‌وری است.",
  },
] as const;

const summarySteps = [
  "مهم‌ترین کار",
  "سخت‌ترین کار",
  "اولِ روز",
  "بدون حواس‌پرتی",
  "تا پایان",
] as const;

function Background() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-28 -top-32 h-[30rem] w-[30rem] rounded-full bg-violet-300/25 blur-3xl" />
      <div className="absolute left-[-10rem] top-[38rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-200/25 blur-3xl" />
      <div className="absolute right-[10%] top-[78rem] h-[24rem] w-[24rem] rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(15,23,42,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.1)_1px,transparent_1px)] [background-size:52px_52px]" />

      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.97),transparent_70%)]" />
    </div>
  );
}

function SectionEyebrow({
  children,
  color = "text-violet-600",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`text-[11px] font-black tracking-[0.22em] ${color}`}
    >
      {children}
    </div>
  );
}

function PillarRow({
  item,
  index,
}: {
  item: (typeof pillars)[number];
  index: number;
}) {
  const accents = [
    "bg-violet-600",
    "bg-fuchsia-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-indigo-600",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 22 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.22),
      }}
      className="group relative flex gap-4 border-b border-slate-200/90 py-5 last:border-b-0 sm:gap-5"
    >
      <div className="relative mt-1 shrink-0">
        <div
          className={`h-2.5 w-2.5 rounded-full ${accents[index]}`}
        />
        {index !== pillars.length - 1 ? (
          <div className="absolute left-1/2 top-4 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-slate-200" />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">
              {item.number}
            </span>
            <h3
              className="text-xl text-slate-950 sm:text-2xl"
              style={{
                fontFamily:
                  "var(--font-display), var(--font-body), Tahoma, sans-serif",
              }}
            >
              {item.title}
            </h3>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm font-bold leading-7 text-slate-500">
            {item.text}
          </p>
        </div>

        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-black text-slate-400 transition-all duration-300 group-hover:border-violet-300 group-hover:bg-violet-50 group-hover:text-violet-700 sm:flex">
          {item.number}
        </div>
      </div>
    </motion.div>
  );
}

function PrincipleItem({
  item,
  index,
}: {
  item: (typeof principles)[number];
  index: number;
}) {
  return (
    <Link
      href={`/games/personal-development/${item.slug}`}
      className="group block"
    >
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{
          duration: 0.45,
          delay: Math.min(index * 0.025, 0.18),
        }}
        className="relative border-t border-slate-200 py-5 transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="flex gap-4">
          <div
            className={`relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
              index % 3 === 0
                ? "bg-violet-600"
                : index % 3 === 1
                  ? "bg-fuchsia-500"
                  : "bg-slate-950"
            }`}
          >
            {item.number}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="text-[1.25rem] leading-8 text-slate-950 transition-colors duration-300 group-hover:text-violet-700 sm:text-[1.4rem]"
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-body), Tahoma, sans-serif",
                  }}
                >
                  {item.title}
                </h3>

                <p className="mt-1 text-sm font-bold leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>

              <span
                className="mt-1 shrink-0 text-lg text-slate-300 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-violet-600"
                aria-hidden
              >
                ←
              </span>
            </div>

            {"detail" in item && item.detail ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.detail.map((entry) => (
                  <span
                    key={entry}
                    className="rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[11px] font-black text-violet-700"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function FrogGrowthPage() {
  return (
    <main
      dir="rtl"
      className={`${displayFont.variable} ${bodyFont.variable} relative min-h-[100dvh] overflow-x-hidden bg-[#F8F7FB] text-slate-900`}
      style={{
        fontFamily: "var(--font-body), Tahoma, sans-serif",
      }}
    >
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 py-2">
          <Link
            href="/games"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-4 py-2 text-xs font-black text-slate-600 shadow-sm backdrop-blur transition-all hover:-translate-x-0.5 hover:border-violet-300 hover:text-violet-700"
          >
            <span
              className="transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            >
              ←
            </span>
            بازگشت به منوی بازی‌ها
          </Link>

          <div className="rounded-full border border-violet-100 bg-violet-50/80 px-3 py-2 text-[11px] font-black text-violet-700 backdrop-blur">
            رشد و توسعه فردی
          </div>
        </header>

        {/* =========================================================
            HERO / DECONSTRUCTION
        ========================================================== */}
        <section className="relative py-12 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20 lg:pr-8"
            >
              <SectionEyebrow>PERSONAL GROWTH / 01</SectionEyebrow>

              <div className="mt-5 max-w-3xl">
                <h1
                  className="text-[4.4rem] leading-[0.92] tracking-tight text-slate-950 sm:text-[6rem] lg:text-[7.5rem]"
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-body), Tahoma, sans-serif",
                  }}
                >
                  رشد
                  <span className="block bg-gradient-to-l from-violet-700 via-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
                    از همین‌جا.
                  </span>
                </h1>

                <div className="mt-7 flex max-w-2xl items-start gap-4">
                  <div className="mt-2 h-16 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-violet-600 via-fuchsia-500 to-cyan-400" />

                  <p className="text-base font-bold leading-8 text-slate-600 sm:text-lg">
                    توسعه فردی یعنی ساختن نسخه‌ای آگاه‌تر، توانمندتر و
                    متعادل‌تر از خودمان؛ مسیری که فقط به موفقیت شغلی محدود
                    نمی‌شود و ذهن، احساسات، روابط، مهارت‌ها و سبک زندگی را
                    نیز دربرمی‌گیرد.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {["آگاهی", "هدف", "یادگیری", "استمرار", "تعادل"].map(
                  (item, index) => (
                    <span
                      key={item}
                      className={`rounded-full border px-3.5 py-2 text-xs font-black ${
                        index === 0
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : index === 1
                            ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                            : index === 2
                              ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                              : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            <div className="relative min-h-[430px] sm:min-h-[500px]">
              {/* Decorative construction lines */}
              <div className="absolute right-[12%] top-[4%] h-24 w-24 border-r border-t border-violet-300" />
              <div className="absolute bottom-[8%] left-[8%] h-28 w-28 border-b border-l border-cyan-300" />

              {/* Back layer */}
              <motion.div
                initial={{ opacity: 0, x: 35, y: -10, rotate: 10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 7 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="absolute right-[4%] top-[8%] h-[68%] w-[72%] rounded-[2.8rem] border border-violet-200 bg-violet-100/70"
              />

              {/* Center layer */}
              <motion.div
                initial={{ opacity: 0, x: -25, y: 15, rotate: -4 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute left-[11%] top-[19%] h-[68%] w-[72%] overflow-hidden rounded-[2.6rem] border border-slate-200 bg-white shadow-[0_35px_90px_rgba(91,33,182,0.12)]"
              >
                <div className="absolute right-0 top-0 h-2 w-28 rounded-bl-full bg-gradient-to-l from-violet-700 via-fuchsia-500 to-cyan-400" />

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">
                      DECONSTRUCTION
                    </span>

                    <span className="text-xs font-black text-violet-600">
                      01
                    </span>
                  </div>

                  <div className="mt-12 max-w-sm">
                    <div
                      className="text-4xl leading-tight text-slate-950 sm:text-5xl"
                      style={{
                        fontFamily:
                          "var(--font-display), var(--font-body), Tahoma, sans-serif",
                      }}
                    >
                      آگاهی
                      <span className="block text-violet-600">
                        قبل از تغییر.
                      </span>
                    </div>

                    <p className="mt-5 text-sm font-bold leading-7 text-slate-500">
                      هر تغییر پایدار، از جایی شروع می‌شود که خودت، مسیرت و
                      اولویت‌هایت را دقیق‌تر می‌بینی.
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-600" />
                    <span className="h-2 w-10 rounded-full bg-fuchsia-500" />
                    <span className="h-2 w-20 rounded-full bg-cyan-400" />
                  </div>
                </div>
              </motion.div>

              {/* Foreground note */}
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: -7 }}
                transition={{ duration: 0.75, delay: 0.5 }}
                className="absolute bottom-[7%] right-[8%] w-[54%] rounded-[2rem] bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:p-6"
              >
                <div className="text-[10px] font-black tracking-[0.18em] text-violet-300">
                  START SMALL
                </div>

                <p
                  className="mt-3 text-2xl leading-9 sm:text-3xl"
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-body), Tahoma, sans-serif",
                  }}
                >
                  یک قدم کوچک
                  <span className="block text-cyan-300">
                    بهتر از توقف است.
                  </span>
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 01 / PERSONAL GROWTH
        ========================================================== */}
        <section
          className="relative mt-8 sm:mt-16"
          aria-labelledby="growth-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <SectionEyebrow>۰۱ / رشد و توسعه فردی</SectionEyebrow>

              <h2
                id="growth-title"
                className="mt-4 text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    "var(--font-display), var(--font-body), Tahoma, sans-serif",
                }}
              >
                نسخه‌ای
                <span className="block text-violet-600">
                  آگاه‌تر از خودت.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm font-bold leading-8 text-slate-500 sm:text-base">
                رشد واقعی فقط به بیشتر کار کردن یا بیشتر دانستن خلاصه نمی‌شود.
                ساختن یک زندگی متعادل، به شناخت خود، انتخاب هدف، یادگیری،
                استمرار و بازنگری مداوم نیاز دارد.
              </p>

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black text-violet-700">
                    ۷ پایه مهم
                  </span>

                  <span className="text-xs font-black text-slate-400">
                    GROWTH SYSTEM
                  </span>
                </div>

                <div className="mt-6 h-px bg-violet-100" />

                <div className="mt-5">
                  <div className="text-sm font-black text-slate-700">
                    رشد یک مسیر چندلایه است؛
                  </div>

                  <div
                    className="mt-2 text-2xl leading-9 text-slate-950"
                    style={{
                      fontFamily:
                        "var(--font-display), var(--font-body), Tahoma, sans-serif",
                    }}
                  >
                    از شناخت خودت شروع می‌شود
                    <span className="block text-violet-600">
                      و با اصلاح مسیر ادامه پیدا می‌کند.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="border-t border-slate-300">
                {pillars.map((item, index) => (
                  <PillarRow
                    key={item.number}
                    item={item}
                    index={index}
                  />
                ))}
              </div>

              {/* Daily exercise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
                className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950"
              >
                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                  <div>
                    <div className="text-[10px] font-black tracking-[0.2em] text-violet-300">
                      DAILY CHECK-IN
                    </div>

                    <h3
                      className="mt-3 text-3xl leading-tight text-white sm:text-4xl"
                      style={{
                        fontFamily:
                          "var(--font-display), var(--font-body), Tahoma, sans-serif",
                      }}
                    >
                      هر شب،
                      <span className="block text-cyan-300">
                        سه سؤال.
                      </span>
                    </h3>

                    <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                      چند دقیقه برای بازنگری روزت کنار بگذار.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {dailyQuestions.map((question, index) => (
                      <div
                        key={question}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5"
                      >
                        <span className="mt-0.5 text-[11px] font-black text-violet-300">
                         {index + 1}
                        </span>

                        <p className="text-sm font-black leading-7 text-slate-200">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="mt-7 border-r-4 border-violet-500 px-5 py-2">
                <p
                  className="text-xl leading-9 text-slate-800 sm:text-2xl"
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-body), Tahoma, sans-serif",
                  }}
                >
                  رشد واقعی زمانی اتفاق می‌افتد که آگاهی به عمل، و عمل به
                  استمرار تبدیل شود.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 02 / EAT THAT FROG
        ========================================================== */}
        <section
          className="relative mt-28 sm:mt-36"
          aria-labelledby="frog-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <SectionEyebrow color="text-fuchsia-600">
                ۰۲ / برگرفته از کتاب
              </SectionEyebrow>

              <h2
                id="frog-title"
                className="mt-4 text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    "var(--font-display), var(--font-body), Tahoma, sans-serif",
                }}
              >
                قورباغه را
                <span className="block bg-gradient-to-l from-violet-700 via-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
                  قورت بده
                </span>
              </h2>

              <p className="mt-4 text-sm font-bold leading-8 text-slate-500">
                نویسنده: برایان تریسی
              </p>

              <div className="mt-7 rounded-[2rem] border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-6">
                <div className="text-xs font-black text-fuchsia-700">
                  ایده مرکزی
                </div>

                <p
                  className="mt-3 text-2xl leading-9 text-slate-950"
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-body), Tahoma, sans-serif",
                  }}
                >
                  کار مهم را
                  <span className="block text-fuchsia-600">
                    قبل از بقیه انجام بده.
                  </span>
                </p>

                <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
                  به‌جای اینکه روز خود را با کارهای راحت و کم‌اهمیت پر کنی،
                  اول همان کاری را انجام بده که بیشترین تأثیر را روی زندگی و
                  اهدافت دارد.
                </p>
              </div>

              {/* Five-step summary */}
              <div className="mt-8">
                <div className="text-xs font-black text-slate-400">
                  خلاصه کل کتاب
                </div>

                <div className="mt-3 space-y-2">
                  {summarySteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white">
                        {index + 1}
                      </span>

                      <span className="text-sm font-black text-slate-700">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-8">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-l from-violet-700 via-fuchsia-500 to-cyan-400" />

                <p className="mt-6 max-w-3xl text-base font-bold leading-8 text-slate-600">
                  این ۲۱ اصل، خلاصه‌ای کاربردی از ایده‌های اصلی کتاب هستند؛
                  از برنامه‌ریزی و اولویت‌بندی شروع می‌کنند و به تمرکز،
                  اقدام فوری و تمام‌کردن کار می‌رسند.
                </p>
              </div>

              <div className="grid gap-x-8 md:grid-cols-2">
                {principles.map((item, index) => (
                  <PrincipleItem
                    key={item.number}
                    item={item}
                    index={index}
                  />
                ))}
              </div>

              {/* Final statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
                className="relative mt-10 overflow-hidden rounded-[2.2rem] bg-slate-950 p-7 text-white sm:p-9"
              >
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
                <div className="absolute -bottom-16 right-12 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

                <div className="relative">
                  <div className="text-[10px] font-black tracking-[0.2em] text-violet-300">
                    THE CORE IDEA
                  </div>

                  <p
                    className="mt-4 max-w-4xl text-3xl leading-[1.55] sm:text-4xl"
                    style={{
                      fontFamily:
                        "var(--font-display), var(--font-body), Tahoma, sans-serif",
                    }}
                  >
                    مهم‌ترین کار را انتخاب کن،
                    <span className="text-violet-300">
                      {" "}
                      سخت‌ترینش را اول انجام بده،
                    </span>
                    <span className="text-cyan-300">
                      {" "}
                      و تا پایان روی همان بمان.
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

    

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs font-bold leading-6 text-slate-400">
            مسیر رشد، با یک تصمیم کوچک برای بهتر شدن آغاز می‌شود.
          </p>
        </footer>
      </div>
    </main>
  );
}