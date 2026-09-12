"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type Category = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  type: string;
  number: string;
};

type IconProps = {
  className?: string;
};

/* =========================================================
   ICONS
========================================================= */

function BrainIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 8.5c-2.5-3.2-7.4-3.1-9.5.4-3.8-.8-7.4 2.2-7 6.1-3.5 1.8-4.1 6.6-1.2 9.2-1.4 3.8 1.5 7.9 5.5 8.1.7 4.2 5.2 6.5 8.8 4.3 1.8 2.7 5.6 3.4 8.1 1.2" />
      <path d="M24 8.5c2.5-3.2 7.4-3.1 9.5.4 3.8-.8 7.4 2.2 7 6.1 3.5 1.8 4.1 6.6 1.2 9.2 1.4 3.8-1.5 7.9-5.5 8.1-.7 4.2-5.2 6.5-8.8 4.3-1.8 2.7-5.6 3.4-8.1 1.2" />
      <path d="M24 8.5v29.8" />
      <path d="M15 15.5c2.4.2 3.8 1.7 3.8 4" />
      <path d="M12 25c2.2-.2 4.1.8 4.8 2.8" />
      <path d="M33 15.5c-2.4.2-3.8 1.7-3.8 4" />
      <path d="M36 25c-2.2-.2-4.1.8-4.8 2.8" />
      <path d="M19.5 34c1.4-1.4 2.8-2 4.5-2" />
      <path d="M28.5 34c-1.4-1.4-2.8-2-4.5-2" />
    </svg>
  );
}

function HeartIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 39S8 29.3 8 18.2C8 12.8 11.9 9 16.8 9c3.1 0 5.8 1.7 7.2 4.2C25.4 10.7 28.1 9 31.2 9 36.1 9 40 12.8 40 18.2 40 29.3 24 39 24 39Z" />
      <path d="M14 23h5l2.3-4.5 4.1 9 2.4-4.5H34" />
    </svg>
  );
}

function GrowthIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 39V21" />
      <path d="M24 28c-6.5-.4-10.8-4.1-11.5-10.8C19.2 17.4 23.1 20.4 24 28Z" />
      <path d="M24 24c.7-7.1 5.2-11.3 12.1-12.1-.7 7.3-5.3 11.6-12.1 12.1Z" />
      <path d="M24 34c-4.2-.2-7.6-2.4-9.2-6.2 5.1-.2 8.2 1.9 9.2 6.2Z" />
      <path d="M24 31c3.4-.2 6.6-1.8 8.2-5 1.4 4.4-1.7 8-8.2 8.3" />
      <path d="M24 39c-5.2 0-9.7-1.1-13.5-3.2" />
      <path d="M24 39c5.2 0 9.7-1.1 13.5-3.2" />
    </svg>
  );
}

function ManagementIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="9" width="32" height="30" rx="5" />
      <path d="M15 17h18" />
      <path d="M15 24h5" />
      <path d="M28 24h5" />
      <path d="M15 31h5" />
      <path d="M28 31h5" />
      <path d="M24 21v6" />
      <path d="M21 24h6" />
    </svg>
  );
}

function SportIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="15" />
      <path d="M24 9v8" />
      <path d="M10.5 18.5 18 21" />
      <path d="m37.5 18.5-7.5 2.5" />
      <path d="M15.5 36.5 20 29" />
      <path d="m32.5 36.5-4.5-7.5" />
      <path d="m24 17 4 3v5l-4 3-4-3v-5l4-3Z" />
    </svg>
  );
}

function FootballIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 7 39 18v17L24 43 9 35V18L24 7Z" />
      <path d="m24 7 5 10-5 6-5-6 5-10Z" />
      <path d="m9 18 10 5" />
      <path d="m39 18-10 5" />
      <path d="m19 23-2 11" />
      <path d="m29 23 2 11" />
      <path d="M24 43V29" />
      <path d="m17 34 7-5 7 5" />
    </svg>
  );
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  switch (id) {
    case "thinking":
      return <BrainIcon className={className} />;

    case "mental-health":
      return <HeartIcon className={className} />;

    case "personal-development":
      return <GrowthIcon className={className} />;

    case "management":
      return <ManagementIcon className={className} />;

    case "sports":
      return <SportIcon className={className} />;

    case "football":
      return <FootballIcon className={className} />;

    default:
      return null;
  }
}

/* =========================================================
   CATEGORIES
========================================================= */

const categories: Category[] = [
  {
    id: "thinking",
    title: "بازی‌های فکری",
    eyebrow: "FOCUS / MEMORY / SPEED",
    description:
      "تمرین‌هایی برای تقویت تمرکز، حافظه، دقت و سرعت پردازش ذهنی.",
    href: "/games/thinking",
    type: "featured",
    number: "01",
  },
  {
    id: "mental-health",
    title: "مدیریت سلامت روان",
    eyebrow: "MIND / BALANCE",
    description:
      "تمرین‌هایی برای شناخت بهتر احساسات و مدیریت ذهن.",
    href: "/games/mental-health",
    type: "rose",
    number: "02",
  },
  {
    id: "personal-development",
    title: "رشد و توسعه فردی",
    eyebrow: "GROW / BUILD",
    description:
      "تمرین‌هایی برای خودشناسی، رشد فردی و ساختن عادت‌های بهتر.",
    href: "/games/personal-development",
    type: "lime",
    number: "03",
  },
  {
    id: "management",
    title: "آموزش مدیریت",
    eyebrow: "THINK / LEAD",
    description:
      "تصمیم‌گیری، برنامه‌ریزی و مهارت‌های مدیریتی.",
    href: "/games/management",
    type: "orange",
    number: "04",
  },
  {
    id: "sports",
    title: "ارکان ورزش",
    eyebrow: "SPORT / PERFORMANCE",
    description:
      "آموزش و تمرین درباره جنبه‌های مختلف ورزش و عملکرد ورزشی.",
    href: "/games/sports",
    type: "cyan",
    number: "05",
  },
  {
    id: "football",
    title: "فوتبال",
    eyebrow: "FOOTBALL / SPORT",
    description:
      "بازی‌ها و تمرین‌های مرتبط با فوتبال و روان‌شناسی ورزشی.",
    href: "/games/football",
    type: "violet",
    number: "06",
  },
];

/* =========================================================
   CARD STYLES
========================================================= */

const smallCardStyles = {
  rose: {
    background:
      "bg-gradient-to-br from-white via-white to-rose-50",
    icon: "bg-rose-100/80 text-rose-600",
    accent: "bg-rose-500",
    glow: "bg-rose-400/20",
    hoverBorder: "group-hover:border-rose-200",
  },

  lime: {
    background:
      "bg-gradient-to-br from-white via-white to-lime-50",
    icon: "bg-lime-100/80 text-lime-700",
    accent: "bg-lime-500",
    glow: "bg-lime-400/20",
    hoverBorder: "group-hover:border-lime-200",
  },

  orange: {
    background:
      "bg-gradient-to-br from-white via-white to-orange-50",
    icon: "bg-orange-100/80 text-orange-600",
    accent: "bg-orange-500",
    glow: "bg-orange-400/20",
    hoverBorder: "group-hover:border-orange-200",
  },

  cyan: {
    background:
      "bg-gradient-to-br from-white via-white to-cyan-50",
    icon: "bg-cyan-100/80 text-cyan-600",
    accent: "bg-cyan-500",
    glow: "bg-cyan-400/20",
    hoverBorder: "group-hover:border-cyan-200",
  },

  violet: {
    background:
      "bg-gradient-to-br from-white via-white to-violet-50",
    icon: "bg-violet-100/80 text-violet-600",
    accent: "bg-violet-500",
    glow: "bg-violet-400/20",
    hoverBorder: "group-hover:border-violet-200",
  },
} as const;

/* =========================================================
   FRAMER MOTION VARIANTS
========================================================= */

const containerVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function GamesLobbyPage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#f5f7fa] text-slate-900"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-200/25 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-48 top-[35%] h-[480px] w-[480px] rounded-full bg-violet-200/25 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-250px] right-[30%] h-[500px] w-[500px] rounded-full bg-lime-200/20 blur-3xl"
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ===================================================
            NAVBAR
        ==================================================== */}

        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
          }}
          className="mb-10 flex items-center justify-between"
        >
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: -6,
                scale: 1.05,
              }}
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] bg-[#111827] text-lg font-black text-white shadow-xl shadow-slate-900/10"
            >
              <span className="relative z-10">ت</span>

              <motion.div
                animate={{
                  x: ["-120%", "120%"],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 w-8 rotate-[20deg] bg-white/15 blur-sm"
              />
            </motion.div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400">
                SPORTS PSYCHOLOGY
              </p>

              <p className="mt-0.5 text-sm font-black text-slate-800">
                تکل
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-black text-slate-500 shadow-sm backdrop-blur-xl transition hover:border-slate-300 hover:text-slate-900"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

            صفحه اصلی
          </Link>
        </motion.header>

        {/* ===================================================
            HERO
        ==================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-[#111827] px-6 py-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <motion.div
              animate={{
                x: ["-10%", "35%", "-10%"],
                y: ["0%", "20%", "0%"],
                rotate: [0, 8, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-32 -top-40 h-[430px] w-[430px] rounded-full bg-cyan-400/20 blur-3xl"
            />

            <motion.div
              animate={{
                x: ["0%", "-25%", "0%"],
                y: ["0%", "10%", "0%"],
              }}
              transition={{
                duration: 17,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-52 left-10 h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-3xl"
            />

            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.5,
                  }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md"
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                  />

                  <span className="text-[10px] font-black tracking-wide text-white/75">
                    فضای تمرین ذهن و عملکرد
                  </span>
                </motion.div>

                <h1 className="max-w-3xl text-4xl font-black leading-[1.25] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  ذهن قوی‌تر،
                  <span className="block bg-gradient-to-l from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                    عملکرد بهتر.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                  بازی و تمرین مورد نظرت را انتخاب کن و مهارت‌های ذهنی،
                  فردی و ورزشی خودت را تقویت کن.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md">
                  <p className="text-[9px] font-bold text-white/45">
                    بخش‌ها
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    ۰۶
                  </p>
                </div>

                <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/[0.07] px-5 py-4 backdrop-blur-md">
                  <p className="text-[9px] font-bold text-cyan-100/50">
                    وضعیت
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(163,230,53,.8)]" />

                    <span className="text-xs font-black text-cyan-100">
                      آماده
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===================================================
            SECTION HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.5,
          }}
          className="mb-5 flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] font-black tracking-[0.15em] text-slate-400">
              EXPLORE
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              مسیرت را انتخاب کن
            </h2>
          </div>

          <div className="hidden text-xs font-bold text-slate-400 sm:block">
            ۶ بخش برای تمرین
          </div>
        </motion.div>

        {/* ===================================================
            BENTO GRID
        ==================================================== */}

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
        >
          {/* FEATURED */}

          <motion.div
            variants={itemVariants}
            className="group sm:col-span-2 lg:col-span-7"
          >
            <Link
              href={categories[0].href}
              className="block h-full"
            >
              <article className="relative min-h-[390px] h-full overflow-hidden rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_12px_45px_rgba(15,23,42,0.06)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:p-9">
                <motion.div
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    x: [0, -20, 0],
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl"
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{
                        rotate: [-5, 5, -3, 0],
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20"
                    >
                      <CategoryIcon
                        id={categories[0].id}
                        className="h-8 w-8"
                      />
                    </motion.div>

                    <div>
                      <p className="text-[10px] font-black tracking-[0.14em] text-indigo-500">
                        {categories[0].eyebrow}
                      </p>

                      <p className="mt-1 text-[11px] font-bold text-slate-400">
                        مسیر شماره {categories[0].number}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{
                      rotate: 45,
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors group-hover:border-indigo-200 group-hover:text-indigo-600"
                  >
                    ↗
                  </motion.div>
                </div>

                <div className="relative z-10 mt-16 max-w-xl">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {categories[0].title}
                  </h3>

                  <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-slate-500">
                    {categories[0].description}
                  </p>
                </div>

                <div className="absolute bottom-7 left-7 right-7 z-10 sm:bottom-9 sm:left-9 sm:right-9">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xs font-black text-slate-400 transition-colors group-hover:text-indigo-600">
                      ورود به بازی‌های فکری
                    </span>

                    <motion.div
                      whileHover={{
                        x: -5,
                      }}
                      className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-lg"
                    >
                      شروع کن
                      <span>←</span>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{
                    x: "-130%",
                  }}
                  animate={{
                    x: ["-130%", "130%"],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-y-0 top-0 w-32 rotate-[18deg] bg-white/25 blur-xl"
                />
              </article>
            </Link>
          </motion.div>

          <SmallCard
            category={categories[1]}
            style={smallCardStyles.rose}
          />

          <SmallCard
            category={categories[2]}
            style={smallCardStyles.lime}
          />

          <SmallCard
            category={categories[3]}
            style={smallCardStyles.orange}
          />

          <SmallCard
            category={categories[4]}
            style={smallCardStyles.cyan}
          />

          <SmallCard
            category={categories[5]}
            style={smallCardStyles.violet}
          />
        </motion.section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <motion.footer
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.6,
          }}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-center sm:flex-row"
        >
          <p className="text-[10px] font-bold text-slate-400">
            تکل • تمرین ذهن، عملکرد و رشد فردی
          </p>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <motion.span
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="h-1.5 w-1.5 rounded-full bg-lime-500"
            />

            آماده برای شروع
          </div>
        </motion.footer>
      </div>
    </main>
  );
}

/* ===============================================================
   SMALL CARD
================================================================ */

function SmallCard({
  category,
  style,
}: {
  category: Category;
  style: {
    background: string;
    icon: string;
    accent: string;
    glow: string;
    hoverBorder: string;
  };
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group sm:col-span-1 lg:col-span-5"
    >
      <Link
        href={category.href}
        className="block h-full"
      >
        <article
          className={`relative flex min-h-[285px] h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 ${style.background} p-6 shadow-[0_8px_35px_rgba(15,23,42,0.045)] transition-all duration-500 ${style.hoverBorder} group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]`}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute -left-20 -top-20 h-52 w-52 rounded-full ${style.glow} blur-3xl`}
          />

          <div className="relative z-10 flex items-start justify-between">
            <motion.div
              whileHover={{
                rotate: [0, -6, 6, 0],
                scale: 1.08,
              }}
              transition={{
                duration: 0.45,
              }}
              className={`flex h-14 w-14 items-center justify-center rounded-[19px] ${style.icon} shadow-sm`}
            >
              <CategoryIcon
                id={category.id}
                className="h-7 w-7"
              />
            </motion.div>

            <span className="rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1 text-[9px] font-black text-slate-400 backdrop-blur">
              {category.number}
            </span>
          </div>

          <div className="relative z-10 mt-7 flex-1">
            <p className="text-[9px] font-black tracking-[0.13em] text-slate-400">
              {category.eyebrow}
            </p>

            <h3 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900">
              {category.title}
            </h3>

            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
              {category.description}
            </p>
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4">
            <span className="text-[10px] font-black text-slate-400 transition-colors group-hover:text-slate-700">
              مشاهده و ورود
            </span>

            <motion.div
              whileHover={{
                x: -5,
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${style.accent} text-sm text-white shadow-md`}
            >
              ←
            </motion.div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}