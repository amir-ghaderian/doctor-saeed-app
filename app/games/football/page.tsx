
"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// داده‌های محتوا
// ─────────────────────────────────────────────

const pillars = [
  {
    icon: "⚽",
    title: "تکنیک",
    desc: "پاس، شوت، دریبل، کنترل و دریافت توپ.",
  },
  {
    icon: "🧠",
    title: "تاکتیک",
    desc: "سازمان‌دهی و انتخاب بهترین روش بازی.",
  },
  {
    icon: "💪",
    title: "آمادگی جسمانی",
    desc: "سرعت، قدرت، استقامت و چابکی.",
  },
  {
    icon: "🎯",
    title: "آمادگی ذهنی",
    desc: "تمرکز، اعتمادبه‌نفس و تصمیم‌گیری.",
  },
  {
    icon: "🤝",
    title: "کار تیمی",
    desc: "هماهنگی و ارتباط بین بازیکنان.",
  },
  {
    icon: "🥅",
    title: "هدف‌گذاری",
    desc: "ایجاد موقعیت، گل‌زنی و کسب نتیجه.",
  },
];

const trainingStages = [
  {
    n: "۰۱",
    title: "آماده‌سازی عمومی",
    items: ["گرم‌کردن", "حرکات کششی و حرکتی", "افزایش تدریجی ضربان قلب"],
  },
  {
    n: "۰۲",
    title: "تمرینات تکنیکی",
    items: [
      "کنترل و دریافت توپ",
      "پاس و شوت",
      "دریبل",
      "سانتر و ضربه سر",
      "مهارت‌های یک‌به‌یک",
    ],
  },
  {
    n: "۰۳",
    title: "تمرینات تاکتیکی",
    items: [
      "حفظ و گردش توپ",
      "پرس کردن",
      "دفاع و پوشش",
      "انتقال از دفاع به حمله و برعکس",
      "ایجاد و استفاده از فضا",
    ],
  },
  {
    n: "۰۴",
    title: "آمادگی جسمانی",
    items: ["سرعت", "استقامت", "قدرت", "چابکی", "تعادل و هماهنگی"],
  },
  {
    n: "۰۵",
    title: "آمادگی ذهنی",
    items: [
      "تمرکز و دقت",
      "تصمیم‌گیری سریع",
      "کنترل هیجان",
      "اعتمادبه‌نفس",
      "حفظ تمرکز در شرایط فشار",
    ],
  },
  {
    n: "۰۶",
    title: "آماده‌سازی اختصاصی مسابقه",
    items: [
      "شناخت حریف",
      "تمرین سناریوهای مسابقه",
      "ضربات ایستگاهی",
      "پنالتی",
      "برنامه حمله و دفاع",
    ],
  },
];

const domains = [
  {
    title: "تکنیک",
    desc: "پایه‌ی اجرای هر حرکت با توپ.",
  },
  {
    title: "تاکتیک",
    desc: "خواندن بازی و انتخاب درست.",
  },
  {
    title: "آمادگی جسمانی",
    desc: "سوخت بدنی برای ۹۰ دقیقه.",
  },
  {
    title: "آمادگی ذهنی",
    desc: "تمرکز در لحظه‌های تعیین‌کننده.",
  },
  {
    title: "ریکاوری",
    desc: "بازگشت به آمادگی برای تمرین بعدی.",
  },
];

// ─────────────────────────────────────────────
// المان‌ها
// ─────────────────────────────────────────────

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200 backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
      {children}
    </div>
  );
}

function PhotoCard({
  src,
  alt,
  ratio = "aspect-[16/9]",
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative ${ratio} w-full overflow-hidden rounded-[2rem] border border-white/15 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent transition-opacity duration-500 group-hover:opacity-70" />

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// صفحه
// ─────────────────────────────────────────────

export default function FootballPage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-white"
    >
      {/* ═══════════════════════════════════════
          BACKGROUND ثابت
      ═══════════════════════════════════════ */}

      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/pic/fotball.jpeg')",
        }}
      />

      {/* لایه تاریک ملایم */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-[#06120c]/35"
      />

      {/* گرادیان خوانایی */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-gradient-to-b from-[#061c11]/10 via-[#06140d]/20 to-[#020805]/55"
      />

      {/* افکت نور */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_5%,rgba(134,239,172,0.18),transparent_28%),radial-gradient(circle_at_15%_50%,rgba(16,185,129,0.07),transparent_25%),radial-gradient(circle_at_85%_70%,rgba(34,197,94,0.06),transparent_25%)]"
      />

      {/* بافت ظریف */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.14) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.10) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "110px 110px",
        }}
      />

      {/* وینیت */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,transparent_42%,rgba(0,0,0,0.30)_100%)]"
      />

      {/* ═══════════════════════════════════════
          محتوای صفحه
      ═══════════════════════════════════════ */}

      <div className="relative z-10">
        {/* ── HERO ── */}
        <header className="mx-auto max-w-6xl px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-10 lg:px-10">
          <div className="mb-12 flex items-center justify-between sm:mb-14">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.06 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xl shadow-[0_0_35px_rgba(74,222,128,0.12)] backdrop-blur-md"
              >
                ⚽
              </motion.div>

              <div>
                <div className="text-sm font-extrabold tracking-wide text-white">
                  تکل
                </div>

                <div className="text-[10px] text-white/45">
                  SPORTS PSYCHOLOGY
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/15 px-4 py-2 text-xs text-white/65 backdrop-blur-md sm:flex">
              فوتبال
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              عملکرد
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              ذهن
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <Eyebrow>درباره‌ی فوتبال</Eyebrow>

            <h1 className="mx-auto mt-7 max-w-4xl text-[38px] font-light leading-[1.35] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:text-[54px] lg:text-[72px]">
              پایه در تکنیک،
              <br />
              <span className="font-extrabold text-emerald-300">
                تمرکز بر آمادگی ذهنی.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] sm:text-lg sm:leading-9">
              فوتبال فقط بازی با توپ نیست؛ ترکیبی از بدن آماده، ذهن متمرکز و
              تیمی هماهنگ است که در این بخش، هر دو رو باهم می‌بینیم.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {["تکنیک", "ذهن", "بدن", "تیم"].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{
                    y: -4,
                    scale: 1.04,
                  }}
                  className="rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-sm text-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/10"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mt-14"
          >
            <PhotoCard
              src="/pic/football1.jpeg"
              alt="صحنه‌ای از بازی یا تمرین فوتبال"
              ratio="aspect-[21/9]"
            />
          </motion.div>
        </header>

        {/* ── تعریف فوتبال ── */}
        <section className="px-5 py-10 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/15 bg-[#07140e]/58 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.23)] backdrop-blur-xl sm:p-10 lg:p-14"
          >
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div>
                <Eyebrow>تعریف بازی</Eyebrow>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  فوتبال چیست؟
                </h2>
              </div>

              <div className="space-y-5 text-base leading-8 text-white/75 sm:text-lg sm:leading-9">
                <p>
                  فوتبال یک ورزش تیمی و رقابتی است که بین دو تیم، معمولاً با
                  ۱۱ بازیکن در زمین انجام می‌شود. هدف اصلی هر تیم، وارد کردن
                  توپ به دروازه حریف و جلوگیری از گل خوردن است.
                </p>

                <p>
                  فوتبال ورزشی است که ترکیبی از تکنیک، تاکتیک، آمادگی جسمانی،
                  تمرکز ذهنی، تصمیم‌گیری، هماهنگی تیمی و مدیریت بازی را به کار
                  می‌گیرد.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── ارکان اصلی ── */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mx-auto max-w-2xl text-center"
            >
              <Eyebrow>رویکرد آماده‌سازی</Eyebrow>

              <h2 className="mt-6 text-3xl font-black drop-shadow-[0_3px_15px_rgba(0,0,0,0.3)] sm:text-4xl">
                ساختاریافته برای عملکرد بهتر در زمین.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/75 sm:text-lg">
                بازی خوب از پیش، در تمرین شکل می‌گیرد. شش رکن زیر، تصویر کاملی
                از چیزی‌اند که یک بازیکن آماده را می‌سازد.
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-8">
              {pillars.map((pillar, index) => (
                <motion.article
                  key={pillar.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.96,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.025,
                  }}
                  className="group relative mx-auto aspect-square w-full max-w-[240px]"
                >
                  <div className="absolute inset-4 rounded-full bg-emerald-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-emerald-300/35 bg-[#081710]/72 px-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-500 group-hover:border-emerald-300/75 group-hover:bg-[#0a1c13]/82 group-hover:shadow-[0_25px_80px_rgba(16,185,129,0.12)]">
                    <div className="absolute inset-2 rounded-full border border-white/[0.05]" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-3xl">
                      {pillar.icon}
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white sm:text-base">
                      {pillar.title}
                    </h3>

                    <p className="mt-2 max-w-[170px] text-[10px] leading-5 text-white/55 sm:text-xs sm:leading-6">
                      {pillar.desc}
                    </p>

                    <div className="absolute bottom-5 h-1 w-7 rounded-full bg-emerald-400/50 transition-all duration-500 group-hover:w-12 group-hover:bg-emerald-300" />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── تصویر میانی ۲ ── */}
        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <PhotoCard
              src="/pic/football2.jpeg"
              alt="بازیکنان در حال تمرین تکنیکی و پاس‌کاری"
              ratio="aspect-[16/7]"
            />
          </div>
        </section>

        {/* ── تمرین و آماده‌سازی ── */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-12"
            >
              <Eyebrow>برنامه‌ی تمرین</Eyebrow>

              <h2 className="mt-6 max-w-2xl text-3xl font-black leading-[1.5] sm:text-4xl">
                هدفمند در اجرا،
                <br className="hidden sm:block" />
                مؤثر در نتیجه.
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg sm:leading-9">
                تمرین فوتبال فرایندی منظم و هدفمند برای ارتقای توانایی‌های فنی،
                تاکتیکی، جسمانی و ذهنی بازیکن است. آماده‌سازی فوتبال نیز به
                مجموعه اقداماتی گفته می‌شود که بازیکن و تیم را برای حضور مؤثر
                در مسابقه آماده می‌کند.
              </p>
            </motion.div>

            <div className="overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#06120c]/62 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="divide-y divide-white/[0.08]">
                {trainingStages.map((stage, index) => (
                  <motion.div
                    key={stage.n}
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.04,
                      ease: "easeOut",
                    }}
                    className="group relative p-6 sm:p-8"
                  >
                    <div className="flex gap-5 sm:gap-7">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-emerald-300/40 bg-emerald-300/[0.07] text-xs font-black text-emerald-300 transition-all duration-500 group-hover:border-emerald-300/80 group-hover:bg-emerald-300/10 group-hover:shadow-[0_0_25px_rgba(74,222,128,0.1)] sm:h-14 sm:w-14">
                        {stage.n}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-base font-black text-white sm:text-lg">
                            {stage.title}
                          </h3>

                          <div className="hidden h-px flex-1 bg-gradient-to-l from-white/10 to-transparent sm:mr-5 sm:block" />
                        </div>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {stage.items.map((item) => (
                            <li
                              key={item}
                              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[11px] text-white/60 transition-all duration-300 group-hover:border-emerald-300/15 group-hover:text-white/75 sm:text-xs"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 h-px w-0 bg-emerald-300/60 transition-all duration-700 group-hover:w-full" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <PhotoCard
                src="/pic/football3.jpeg"
                alt="تمرین آمادگی جسمانی فوتبال"
                ratio="aspect-square"
              />

              <PhotoCard
                src="/pic/football4.jpeg"
                alt="تمرکز و آمادگی ذهنی بازیکن فوتبال"
                ratio="aspect-square"
              />
            </div>
          </div>
        </section>

        {/* ── اصل تمرین ── */}
        <section className="px-5 py-10 sm:px-8 lg:px-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.75rem] border border-emerald-300/15 bg-[#04140c]/70 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-12 lg:p-16"
          >
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-green-300/10 blur-3xl" />

            <div className="relative">
              <Eyebrow>اصل تمرین</Eyebrow>

              <p className="mt-7 max-w-3xl text-xl font-light leading-[2] text-white/90 sm:text-2xl lg:text-3xl">
                تمرین خوب فقط سخت تمرین کردن نیست؛ بلکه تمرین باید{" "}
                <span className="font-extrabold text-emerald-300">
                  هدفمند، مرحله‌ای
                </span>
                ، متناسب با شرایط بازیکن و در ارتباط با نیازهای واقعی مسابقه
                باشد.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── قلمروهای آمادگی ── */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Eyebrow>قلمروهای آمادگی</Eyebrow>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl">
                پنج قلمرو، یک نتیجه.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {domains.map((domain, index) => (
                <motion.article
                  key={domain.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07150e]/62 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                >
                  <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-emerald-300/30 bg-emerald-300/[0.06] text-emerald-300 transition-all duration-500 group-hover:border-emerald-300/70 group-hover:rotate-6">
                      <span className="text-xs font-black">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-5 font-black text-white">
                      {domain.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/55">
                      {domain.desc}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                        PERFORMANCE
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 transition-all duration-300 group-hover:border-emerald-300/25 group-hover:bg-emerald-300/10 group-hover:text-emerald-300">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* عکس پنجم */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-10"
            >
              <PhotoCard
                src="/pic/fotball5.jpeg"
                alt="بازیکنان فوتبال در فضای مسابقه"
                ratio="aspect-[16/6]"
              />
            </motion.div>
          </div>
        </section>

        {/* ── پایان ── */}
        <section className="border-t border-white/10 px-5 py-24 text-center sm:px-8 lg:py-32">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <div className="mx-auto h-px w-28 bg-gradient-to-l from-transparent via-emerald-300/60 to-transparent" />

            <p className="mx-auto mt-8 max-w-2xl text-3xl leading-[1.6] sm:text-4xl lg:text-5xl">
              <span className="font-light text-white/85">
                تمرین هدفمند.
              </span>{" "}
              <span className="font-extrabold text-emerald-300">
                آمادگی واقعی.
              </span>
            </p>

            <p className="mt-5 text-sm leading-7 text-white/50 sm:text-base">
              از زمین محله تا روز مسابقه، یک مسیر آماده‌سازی مشخص.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/15 px-5 py-3 text-xs text-white/55 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
              آموزش فوتبال • تکل
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

