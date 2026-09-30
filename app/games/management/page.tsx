
"use client";

import { motion } from "framer-motion";

/* =========================================================
   DATA
========================================================= */

const principles = [
  {
    number: "01",
    title: "برنامه‌ریزی",
    english: "PLANNING",
    description:
      "تعیین هدف، شناخت مسیر، اولویت‌بندی کارها و مشخص کردن زمان و منابع موردنیاز برای رسیدن به نتیجه.",
    icon: "target",
  },
  {
    number: "02",
    title: "سازمان‌دهی",
    english: "ORGANIZING",
    description:
      "تقسیم وظایف، تعیین مسئولیت‌ها و ایجاد هماهنگی میان افراد، واحدها و منابع برای اجرای منظم.",
    icon: "structure",
  },
  {
    number: "03",
    title: "هدایت و رهبری",
    english: "LEADING",
    description:
      "ایجاد انگیزه، ارتباط مؤثر، تصمیم‌گیری و همراه کردن افراد در مسیر رسیدن به هدف مشترک.",
    icon: "leader",
  },
  {
    number: "04",
    title: "کنترل و ارزیابی",
    english: "CONTROLLING",
    description:
      "بررسی عملکرد، مقایسه نتایج با اهداف، شناسایی فاصله‌ها و اصلاح مسیر پیش از ایجاد مشکل بزرگ.",
    icon: "chart",
  },
  {
    number: "05",
    title: "تصمیم‌گیری",
    english: "DECISION MAKING",
    description:
      "انتخاب آگاهانه میان گزینه‌ها بر اساس اطلاعات، شرایط، منابع، پیامدها و اهداف سازمان.",
    icon: "decision",
  },
];

const sportsAreas = [
  {
    title: "عملیات و رویدادهای ورزشی",
    text:
      "برنامه‌ریزی مسابقات، اردوها، تمرین‌ها، امکانات و فرآیندهای اجرایی برای اینکه همه‌چیز در زمان مناسب و با هماهنگی انجام شود.",
    icon: "activity",
    size: "large",
  },
  {
    title: "داده و تحلیل",
    text:
      "استفاده از اطلاعات برای سنجش عملکرد، پیدا کردن روندها و کمک به تصمیم‌های دقیق‌تر.",
    icon: "analytics",
    size: "small",
  },
  {
    title: "رهبری و منابع انسانی",
    text:
      "ساخت تیم، تقسیم مسئولیت، توسعه افراد و ایجاد فرهنگ سازمانی مناسب برای عملکرد پایدار.",
    icon: "users",
    size: "small",
  },
  {
    title: "بازاریابی، برند و درآمد",
    text:
      "ارتباط با هواداران، رسانه، اسپانسرینگ، هویت برند و طراحی مسیرهای درآمدی متناسب با اکوسیستم ورزش.",
    icon: "megaphone",
    size: "large",
  },
  {
    title: "مالی و مدیریت ریسک",
    text:
      "مدیریت بودجه، اولویت‌بندی هزینه‌ها، کنترل منابع و آمادگی برای موقعیت‌های پیش‌بینی‌نشده.",
    icon: "wallet",
    size: "small",
  },
  {
    title: "حکمرانی و سلامت ورزشکار",
    text:
      "شفافیت، اخلاق، ایمنی، مسئولیت‌پذیری و توجه به سلامت و رفاه ورزشکار در تصمیم‌های مدیریتی.",
    icon: "shield",
    size: "large",
  },
];

const modernManagement = [
  {
    number: "01",
    title: "تصمیم‌گیری مبتنی بر داده",
    text:
      "مدیر مدرن فقط به حدس و تجربه تکیه نمی‌کند. داده را جمع می‌کند، تحلیل می‌کند و از آن برای تصمیم بهتر استفاده می‌کند.",
    icon: "database",
  },
  {
    number: "02",
    title: "انسان در مرکز سیستم",
    text:
      "ورزشکار، مربی، مدیر و کارکنان فقط منابع سازمان نیستند؛ کیفیت ارتباط، انگیزه، سلامت و تجربه آن‌ها بخشی از عملکرد سیستم است.",
    icon: "heart",
  },
  {
    number: "03",
    title: "ریسک، اخلاق و مسئولیت",
    text:
      "مدیریت حرفه‌ای پیش از بحران فکر می‌کند؛ ریسک‌ها را می‌شناسد و برای ایمنی، شفافیت و پاسخ‌گویی آماده است.",
    icon: "shield",
  },
];

const managementCycle = [
  {
    number: "01",
    title: "هدف‌گذاری",
    description: "دقیقاً می‌دانیم قرار است به چه نتیجه‌ای برسیم.",
    icon: "goal",
  },
  {
    number: "02",
    title: "برنامه‌ریزی",
    description: "مسیر، زمان، منابع و اولویت‌ها را مشخص می‌کنیم.",
    icon: "plan",
  },
  {
    number: "03",
    title: "سازمان‌دهی",
    description: "افراد، نقش‌ها و منابع را در جای درست قرار می‌دهیم.",
    icon: "structure",
  },
  {
    number: "04",
    title: "اجرا و رهبری",
    description: "برنامه را اجرا می‌کنیم و تیم را در مسیر نگه می‌داریم.",
    icon: "leader",
  },
  {
    number: "05",
    title: "کنترل و ارزیابی",
    description: "نتیجه را می‌سنجیم و فاصله با هدف را پیدا می‌کنیم.",
    icon: "chart",
  },
  {
    number: "06",
    title: "اصلاح و بهبود",
    description: "از نتیجه یاد می‌گیریم و چرخه را بهتر از قبل تکرار می‌کنیم.",
    icon: "refresh",
  },
];

/* =========================================================
   ICON
========================================================= */

function Icon({
  name,
  size = 22,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" />
        </svg>
      );

    case "structure":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="5" rx="1.5" />
          <rect x="3" y="16" width="6" height="5" rx="1.5" />
          <rect x="15" y="16" width="6" height="5" rx="1.5" />
          <path d="M12 8v4M6 16v-2h12v2M18 14v-2" />
        </svg>
      );

    case "leader":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6" />
          <path d="m18 5 2 2 3-3" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-6" />
          <path d="M18 7h2v2" />
        </svg>
      );

    case "decision":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M8 6h5a3 3 0 0 1 3 3v3" />
          <path d="m16 10 2 2 2-2" />
          <path d="M16 18h-5a3 3 0 0 1-3-3v-1" />
          <path d="m8 12-2 2-2-2" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 5 14 2-7h5" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M7 16v-4M11 16V8M15 16v-6M19 16v-9" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 21c.8-4 2.9-6 6-6s5.2 2 6 6" />
          <path d="M14 15c2.8.1 4.7 1.8 5.5 5" />
        </svg>
      );

    case "megaphone":
      return (
        <svg {...common}>
          <path d="m4 10 11-5v14L4 14z" />
          <path d="M15 9h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3" />
          <path d="M7 15l1.5 5" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M16 14h3" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        </svg>
      );

    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 8.5c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.8 2.3Z" />
        </svg>
      );

    case "goal":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="m12 12 5-5" />
          <path d="M17 7h2v2" />
        </svg>
      );

    case "plan":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
          <path d="m15.5 15.5 1 1 2-2" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14-4L4 9" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14 4l2-2" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    case "brain":
      return (
        <svg {...common}>
          <path d="M9.5 4A3.5 3.5 0 0 0 6 7.5c0 .5.1 1 .3 1.4A3.8 3.8 0 0 0 4 12.5 3.5 3.5 0 0 0 7.5 16c.2 0 .4 0 .6-.1A3.5 3.5 0 0 0 11 19v-4" />
          <path d="M14.5 4A3.5 3.5 0 0 1 18 7.5c0 .5-.1 1-.3 1.4a3.8 3.8 0 0 1 2.3 3.6 3.5 3.5 0 0 1-3.5 3.5c-.2 0-.4 0-.6-.1A3.5 3.5 0 0 1 13 19v-4" />
          <path d="M12 5v14M9 8h3M12 12h3M9 15h3" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/* =========================================================
   MOTION
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

/* =========================================================
   COMPONENTS
========================================================= */

function SectionLabel({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-black tracking-[0.15em]",
        dark
          ? "border border-white/10 bg-white/[0.06] text-indigo-200"
          : "border border-indigo-100 bg-indigo-50 text-indigo-700",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          dark ? "bg-cyan-300" : "bg-indigo-500",
        ].join(" ")}
      />
      {children}
    </div>
  );
}

function StatCard({
  number,
  label,
  delay,
}: {
  number: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.45, delay }}
      className="rounded-2xl border border-slate-200/80 bg-white/85 px-3 py-4 text-center shadow-sm backdrop-blur"
    >
      <div className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: delay + 0.15 }}
        >
          {number}
        </motion.span>
      </div>

      <p className="mt-1 text-[11px] font-semibold text-slate-500 sm:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

function SportsCard({
  title,
  text,
  icon,
  size,
}: {
  title: string;
  text: string;
  icon: string;
  size: "small" | "large";
}) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ duration: 0.45 }}
      className={[
        "group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045]",
        "transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/[0.065]",
        size === "large"
          ? "min-h-[245px] lg:col-span-2"
          : "min-h-[245px] lg:col-span-1",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.14),transparent_30%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/[0.06] blur-3xl transition-transform duration-700 group-hover:scale-150" />

      <div className="relative flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-indigo-200 ring-1 ring-white/10 transition-all duration-500 group-hover:bg-indigo-500/15 group-hover:text-cyan-200">
            <Icon name={icon} size={23} />
          </div>

          <span className="text-[10px] font-black tracking-[0.2em] text-slate-500">
            SPORT MANAGEMENT
          </span>
        </div>

        <h3 className="mt-8 max-w-xl text-xl font-black leading-8 text-white sm:text-2xl">
          {title}
        </h3>

        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-400">
          {text}
        </p>

        <div className="mt-auto pt-6">
          <div className="h-px w-0 bg-gradient-to-l from-indigo-300 to-cyan-300 transition-all duration-500 group-hover:w-20" />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ManagementPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950"
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-white">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.09) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage:
                "radial-gradient(circle at center, black 0%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 0%, transparent 72%)",
            }}
          />
        </div>

        {/* Animated glow */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -right-24 top-28 -z-10 h-72 w-72 rounded-full bg-indigo-500/[0.08] blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-10 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
            {/* Hero text */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.45 }}
              >
                <SectionLabel>MANAGEMENT</SectionLabel>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-6 text-4xl font-black leading-[1.16] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.6rem]"
              >
                مدیریت؛
                <span className="mt-2 block bg-gradient-to-l from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  تبدیل هدف به عملکرد
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9"
              >
                مدیریت یعنی بدانیم چه کاری، با چه هدفی، توسط چه کسی، چگونه و
                در چه زمانی انجام شود؛ و در نهایت نتیجه را بسنجیم و برای بهتر
                شدن تصمیم بگیریم.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="mt-8 flex flex-wrap gap-2.5"
              >
                {[
                  "هدف‌گذاری",
                  "برنامه‌ریزی",
                  "سازمان‌دهی",
                  "رهبری",
                  "ارزیابی",
                  "بهبود مستمر",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={stagger}
                className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4"
              >
                <StatCard
                  number={5}
                  label="اصل کلیدی"
                  delay={0.05}
                />

                <StatCard
                  number={6}
                  label="گام مدیریتی"
                  delay={0.11}
                />

                <StatCard
                  number={1}
                  label="چرخه بهبود"
                  delay={0.17}
                />
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)] sm:p-6">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-cyan-500/[0.05]" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black tracking-[0.2em] text-indigo-500">
                        MANAGEMENT SYSTEM
                      </div>

                      <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                        چرخه مدیریت
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                      <Icon name="brain" size={21} />
                    </div>
                  </div>

                  <div className="relative mt-7">
                    <div className="absolute right-[22px] top-5 bottom-5 w-px bg-gradient-to-b from-indigo-200 via-cyan-200 to-emerald-200" />

                    <div className="space-y-2.5">
                      {[
                        ["01", "هدف‌گذاری", "کجا می‌خواهیم برسیم؟"],
                        ["02", "برنامه‌ریزی", "چطور به آنجا برسیم؟"],
                        [
                          "03",
                          "سازمان‌دهی",
                          "چه کسی چه کاری انجام دهد؟",
                        ],
                        ["04", "اجرا و رهبری", "برنامه را به عمل تبدیل کن."],
                        ["05", "کنترل و ارزیابی", "چه اتفاقی افتاده است؟"],
                        ["06", "اصلاح و بهبود", "دفعه بعد بهتر عمل کن."],
                      ].map(([number, title, description], index) => (
                        <motion.div
                          key={number}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.35 + index * 0.08,
                          }}
                          className="group relative flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/90 px-3.5 py-3 transition-all duration-300 hover:-translate-x-1 hover:border-indigo-100 hover:bg-white hover:shadow-md"
                        >
                          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[11px] font-black text-indigo-700 shadow-sm ring-1 ring-slate-100">
                            {number}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900">
                              {title}
                            </p>

                            <p className="mt-0.5 text-xs leading-6 text-slate-500">
                              {description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* floating cards */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 -top-5 hidden rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-lg sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-black text-slate-700">
                    تصمیم بهتر
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-3 bottom-5 hidden rounded-2xl border border-cyan-100 bg-white px-4 py-3 shadow-lg sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className="text-xs font-black text-slate-700">
                    عملکرد بهتر
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRINCIPLES
      ===================================================== */}

      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45 }}
            >
              <SectionLabel>MANAGEMENT BASICS</SectionLabel>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl"
            >
              مدیریت از چند تصمیم اصلی ساخته می‌شود
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-5 text-base leading-8 text-slate-600 sm:text-lg"
            >
              مدیریت حرفه‌ای فقط دستور دادن نیست. یک مدیر باید بتواند هدف
              تعیین کند، سیستم بسازد، افراد را هماهنگ کند، نتیجه را اندازه
              بگیرد و بر اساس آن مسیر را اصلاح کند.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            {principles.map((item) => (
              <motion.article
                key={item.number}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="group relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30 sm:p-6"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-cyan-500/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition-transform duration-500 group-hover:scale-105">
                      <Icon name={item.icon} size={20} />
                    </div>

                    <span className="text-xs font-black tracking-[0.15em] text-slate-300">
                      {item.number}
                    </span>
                  </div>

                  <div className="text-[10px] font-black tracking-[0.14em] text-indigo-500">
                    {item.english}
                  </div>

                  <h3 className="mt-2 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SPORTS MANAGEMENT
      ===================================================== */}

      <section
        id="sports-management"
        className="relative overflow-hidden bg-slate-950 text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(circle at center, black 0%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 0%, transparent 78%)",
            }}
          />

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-indigo-500/[0.16] blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[0.10] blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="flex justify-center"
            >
              <SectionLabel dark>SPORT MANAGEMENT</SectionLabel>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-6 text-4xl font-black leading-[1.16] tracking-[-0.045em] sm:text-6xl"
            >
              مدیریت ورزشی
              <span className="mt-2 block bg-gradient-to-l from-cyan-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                جایی که مدیریت وارد میدان می‌شود
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9"
            >
              در ورزش، مدیریت فقط درباره‌ی نتیجه‌ی یک مسابقه نیست. مدیر
              ورزشی باید میان عملکرد، ورزشکار، مربی، منابع، هواداران، رویداد،
              درآمد، ریسک و اهداف بلندمدت سازمان تعادل ایجاد کند.
            </motion.p>
          </motion.div>

          {/* Main sports management card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-sm"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-indigo-400 to-transparent" />

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-9 lg:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/20">
                    <Icon name="brain" size={23} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black tracking-[0.18em] text-slate-500">
                      SPORT MANAGEMENT MINDSET
                    </div>

                    <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
                      مدیر ورزشی باید چند سیستم را هم‌زمان ببیند
                    </h3>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-8 text-slate-300 sm:text-base">
                  در یک باشگاه، فدراسیون یا رویداد ورزشی، هیچ تصمیمی کاملاً
                  جدا از بقیه نیست. یک تغییر در بودجه، برنامه، نیروی انسانی
                  یا ارتباط با هوادار می‌تواند روی بخش‌های دیگر هم اثر بگذارد.
                  به همین دلیل مدیریت ورزشی به نگاه سیستمی نیاز دارد.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    ["عملکرد", "Performance"],
                    ["افراد", "People"],
                    ["منابع", "Resources"],
                    ["تجربه", "Experience"],
                  ].map(([fa, en]) => (
                    <div
                      key={fa}
                      className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 transition-colors duration-300 hover:bg-white/[0.05]"
                    >
                      <div className="text-sm font-black text-white">
                        {fa}
                      </div>
                      <div className="mt-1 text-[10px] font-semibold text-slate-500">
                        {en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 bg-black/[0.08] p-6 sm:p-9 lg:border-r lg:border-t-0 lg:p-10">
                <div className="h-full">
                  <div className="text-xs font-black tracking-[0.16em] text-cyan-300">
                    PROFESSIONAL APPROACH
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {[
                      "هدف روشن",
                      "اطلاعات قابل اتکا",
                      "نقش‌های شفاف",
                      "اجرای منسجم",
                      "اندازه‌گیری نتیجه",
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: 0.25 + index * 0.07,
                        }}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-[10px] font-black text-slate-900">
                          {index + 1}
                        </span>

                        <span className="text-sm font-bold text-slate-200">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sports bento */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            variants={stagger}
            className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {sportsAreas.map((item) => (
              <SportsCard
                key={item.title}
                title={item.title}
                text={item.text}
                icon={item.icon}
                size={item.size as "small" | "large"}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MODERN MANAGEMENT
      ===================================================== */}

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45 }}
            >
              <SectionLabel>MODERN APPROACH</SectionLabel>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
                مدیریت مدرن
                <span className="mt-1 block text-indigo-700">
                  فقط اداره کردن نیست
                </span>
              </h2>
            </motion.div>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg"
            >
              مدیر حرفه‌ای سیستمی می‌سازد که بتواند تصمیم بگیرد، اجرا کند،
              اندازه بگیرد، از نتیجه یاد بگیرد و خودش را بهبود دهد.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="mt-12 grid gap-5 lg:grid-cols-3"
          >
            {modernManagement.map((item) => (
              <motion.article
                key={item.number}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="group relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 sm:p-7"
              >
                <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/[0.045] blur-3xl transition-transform duration-700 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon name={item.icon} size={21} />
                    </div>

                    <span className="text-[11px] font-black tracking-[0.15em] text-slate-300">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-8 text-slate-600">
                    {item.text}
                  </p>

                  <div className="mt-7 h-px w-12 bg-gradient-to-l from-indigo-500 to-cyan-400 transition-all duration-500 group-hover:w-20" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MANAGEMENT FORMULA
      ===================================================== */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="flex justify-center"
            >
              <SectionLabel>THE MANAGEMENT FORMULA</SectionLabel>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl"
            >
              فرمول ساده مدیریت
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-5 text-base leading-8 text-slate-600 sm:text-lg"
            >
              مدیریت یک نقطه پایان نیست؛ یک چرخه است. هر نتیجه، اطلاعات تازه‌ای
              برای تصمیم بعدی تولید می‌کند.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            variants={stagger}
            className="relative mx-auto mt-14 max-w-6xl"
          >
            {/* desktop connector */}
            <div className="pointer-events-none absolute right-[7%] left-[7%] top-8 hidden h-px bg-gradient-to-l from-indigo-100 via-cyan-200 to-emerald-100 lg:block" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {managementCycle.map((step, index) => (
                <motion.article
                  key={step.number}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                  className="group relative rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/25"
                >
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-sm ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-105">
                    <Icon name={step.icon} size={19} />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.16em] text-indigo-500">
                      {step.number}
                    </span>

                    {index < managementCycle.length - 1 && (
                      <span className="hidden text-slate-300 lg:block">
                        ←
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-black text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* formula bar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto mt-9 max-w-5xl rounded-[1.8rem] border border-indigo-100 bg-gradient-to-l from-indigo-50 via-white to-cyan-50 px-5 py-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-black text-slate-800 sm:text-base">
              <span>هدف‌گذاری</span>
              <span className="text-indigo-500">←</span>
              <span>برنامه‌ریزی</span>
              <span className="text-indigo-500">←</span>
              <span>سازمان‌دهی</span>
              <span className="text-indigo-500">←</span>
              <span>اجرا و رهبری</span>
              <span className="text-indigo-500">←</span>
              <span>کنترل</span>
              <span className="text-indigo-500">←</span>
              <span className="text-slate-950">
                اصلاح و بهبود
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-slate-50 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-300/30 sm:px-10 sm:py-14 lg:px-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(34,211,238,0.15),transparent_28%)]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-indigo-400 to-transparent" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="text-[10px] font-black tracking-[0.2em] text-indigo-300">
                  TEKEL / MANAGEMENT
                </div>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                  مدیر خوب فقط کارها را پیش نمی‌برد؛
                  <span className="mt-2 block text-cyan-300">
                    سیستم بهتر می‌سازد.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                  در مدیریت ورزشی، نتیجه‌ی پایدار از کنار هم قرار گرفتن
                  تصمیم‌های درست به وجود می‌آید؛ از زمین بازی تا اتاق مدیریت.
                </p>
              </div>

              <motion.a
                href="/games"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 transition-colors duration-300 hover:bg-slate-100"
              >
                بازگشت به بازی‌ها
                <span aria-hidden="true">←</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

