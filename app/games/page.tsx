"use client";
 
import Link from "next/link";
import { Brain, HeartPulse, Sprout, Compass, Trophy, Goal, type LucideIcon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
 
/* =========================================================
   ICONS (lucide-react)
========================================================= */
 
const icons: Record<string, LucideIcon> = {
  thinking: Brain,
  "mental-health": HeartPulse,
  "personal-development": Sprout,
  management: Compass,
  sports: Trophy,
  football: Goal,
};
 
function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = icons[id];
  return Icon ? <Icon className={className} strokeWidth={1.8} aria-hidden="true" /> : null;
}
 
/* =========================================================
   DATA  (آدرس‌ها دست‌نخورده)
========================================================= */
 
type Category = {
  id: string;
  title: string;
  description: string;
  href: string;
};
 
const categories: Category[] = [
  {
    id: "thinking",
    title: "بازی‌های فکری",
    description: "تمرین‌هایی برای تقویت تمرکز، حافظه، دقت و سرعت پردازش ذهنی.",
    href: "/games/thinking",
  },
  {
    id: "mental-health",
    title: "مدیریت سلامت روان",
    description: "تمرین‌هایی برای شناخت بهتر احساسات و مدیریت ذهن.",
    href: "/games/mental-health",
  },
  {
    id: "personal-development",
    title: "رشد و توسعه فردی",
    description: "تمرین‌هایی برای خودشناسی، رشد فردی و ساختن عادت‌های بهتر.",
    href: "/games/personal-development",
  },
  {
    id: "management",
    title: "آموزش مدیریت",
    description: "تصمیم‌گیری، برنامه‌ریزی و مهارت‌های مدیریتی.",
    href: "/games/management",
  },
  {
    id: "sports",
    title: "ارکان ورزش",
    description: "آموزش و تمرین درباره جنبه‌های مختلف ورزش و عملکرد ورزشی.",
    href: "/games/sports",
  },
  {
    id: "football",
    title: "فوتبال",
    description: "بازی‌ها و تمرین‌های مرتبط با فوتبال و روان‌شناسی ورزشی.",
    href: "/games/football",
  },
];
 
// color = رنگ نور/خط نور، icon و bg = استایل کارت‌های کوچک
const cardStyles: Record<string, { color: string; icon: string; bg: string; accent: string }> = {
  thinking: { color: "#6366f1", icon: "", bg: "", accent: "" },
  "mental-health": {
    color: "#f43f5e",
    icon: "bg-rose-100/80 text-rose-600",
    bg: "bg-gradient-to-br from-white via-white to-rose-50",
    accent: "bg-rose-500",
  },
  "personal-development": {
    color: "#84cc16",
    icon: "bg-lime-100/80 text-lime-700",
    bg: "bg-gradient-to-br from-white via-white to-lime-50",
    accent: "bg-lime-500",
  },
  management: {
    color: "#f97316",
    icon: "bg-orange-100/80 text-orange-600",
    bg: "bg-gradient-to-br from-white via-white to-orange-50",
    accent: "bg-orange-500",
  },
  sports: {
    color: "#06b6d4",
    icon: "bg-cyan-100/80 text-cyan-600",
    bg: "bg-gradient-to-br from-white via-white to-cyan-50",
    accent: "bg-cyan-500",
  },
  football: {
    color: "#8b5cf6",
    icon: "bg-violet-100/80 text-violet-600",
    bg: "bg-gradient-to-br from-white via-white to-violet-50",
    accent: "bg-violet-500",
  },
};
 
/* =========================================================
   MOTION
========================================================= */
 
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
 
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
 
const SPRING = { stiffness: 180, damping: 18 };
 
const STARS = [
  { x: 12, y: 80, d: 0 },
  { x: 28, y: 65, d: 0.4 },
  { x: 47, y: 88, d: 0.9 },
  { x: 63, y: 72, d: 0.2 },
  { x: 78, y: 90, d: 0.7 },
  { x: 90, y: 60, d: 1.1 },
  { x: 55, y: 50, d: 1.4 },
];
 
/* =========================================================
   INTERACTIVE CARD
   اسپات‌لایت دنبال ماوس + خط نور چرخان + کج‌شدن ملایم + ستاره‌ها
   (افکت‌ها فقط با ماوس فعال می‌شوند و با reduced-motion خاموش می‌شوند)
========================================================= */
 
function InteractiveCard({
  href,
  color,
  radius,
  className = "",
  innerClassName = "",
  children,
}: {
  href: string;
  color: string;
  radius: number;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
 
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), SPRING);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), SPRING);
 
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ref.current.style.setProperty("--x", `${x}px`);
    ref.current.style.setProperty("--y", `${y}px`);
    if (!reduce) {
      mx.set(x / r.width - 0.5);
      my.set(y / r.height - 0.5);
    }
  }
 
  function onLeave() {
    setHover(false);
    mx.set(0);
    my.set(0);
  }
 
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group ${className}`}
    >
      <Link
        href={href}
        style={{ borderRadius: radius }}
        className="relative block h-full overflow-hidden bg-slate-200/80 p-px outline-none focus-visible:ring-2 focus-visible:ring-slate-900/60"
      >
        {/* خط نور چرخان دور کارت */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute -inset-[70%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{
              background: `conic-gradient(from 0deg, transparent 0 72%, ${color} 88%, transparent 100%)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          />
        )}
 
        <article
          style={{ borderRadius: radius - 1 }}
          className={`relative h-full overflow-hidden bg-white shadow-[0_8px_35px_rgba(15,23,42,0.045)] transition-shadow duration-500 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] ${innerClassName}`}
        >
          {/* هاله‌ی ثابت گوشه */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full blur-3xl"
            style={{ background: `${color}26` }}
          />
 
          {/* نور دنبال‌کننده ماوس */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), ${color}2b, transparent 65%)`,
            }}
          />
 
          {/* ستاره‌های ریز هنگام هاور */}
          {hover &&
            !reduce &&
            STARS.map((s, i) => (
              <motion.i
                key={i}
                aria-hidden
                className="pointer-events-none absolute h-1 w-1 rounded-full"
                style={{ left: `${s.x}%`, top: `${s.y}%`, background: color }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -26 }}
                transition={{ duration: 1.9, delay: s.d, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
 
          {children}
        </article>
      </Link>
    </motion.div>
  );
}
 
/* =========================================================
   MEMORY TILES  (تنها حرکت خودکار کارت‌ها؛ اشاره به بازی حافظه)
========================================================= */
 
function MemoryTiles({ color }: { color: string }) {
  const order = [0, 5, 2, 7, 3];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-7 top-28 z-10 hidden grid-cols-4 gap-2 sm:grid sm:left-9"
    >
      {Array.from({ length: 8 }).map((_, i) => {
        const step = order.indexOf(i);
        return (
          <motion.span
            key={i}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50"
            animate={
              step >= 0
                ? { backgroundColor: ["#f8fafc", color, "#f8fafc"] }
                : undefined
            }
            transition={
              step >= 0
                ? { duration: 0.7, delay: step * 0.8, repeat: Infinity, repeatDelay: 4.3, ease: "easeInOut" }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
 
/* =========================================================
   FEATURED CARD
========================================================= */
 
function FeaturedCard({ category }: { category: Category }) {
  const { color } = cardStyles[category.id];
 
  return (
    <InteractiveCard
      href={category.href}
      color={color}
      radius={34}
      className="sm:col-span-2 lg:col-span-4 lg:row-span-2"
      innerClassName="min-h-[390px] p-7 sm:p-9"
    >
      <MemoryTiles color={color} />
 
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
          <CategoryIcon id={category.id} className="h-8 w-8" />
        </div>
 
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors group-hover:border-indigo-200 group-hover:text-indigo-600">
          ↗
        </div>
      </div>
 
      <div className="relative z-10 mt-16 max-w-xl">
        <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {category.title}
        </h3>
        <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-slate-500">
          {category.description}
        </p>
      </div>
 
      <div className="absolute bottom-7 left-7 right-7 z-10 sm:bottom-9 sm:left-9 sm:right-9">
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-xs font-black text-slate-400 transition-colors group-hover:text-indigo-600">
            ورود به بازی‌های فکری
          </span>
 
          <span className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-lg">
            شروع کن
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          </span>
        </div>
      </div>
    </InteractiveCard>
  );
}
 
/* =========================================================
   SMALL CARD
========================================================= */
 
function SmallCard({ category, wide = false }: { category: Category; wide?: boolean }) {
  const s = cardStyles[category.id];
 
  return (
    <InteractiveCard
      href={category.href}
      color={s.color}
      radius={30}
      className={wide ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-2"}
      innerClassName={`flex min-h-[240px] flex-col p-6 ${s.bg}`}
    >
      <div className="relative z-10">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[19px] shadow-sm transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 ${s.icon}`}
        >
          <CategoryIcon id={category.id} className="h-7 w-7" />
        </div>
      </div>
 
      <div className="relative z-10 mt-7 flex-1">
        <h3 className="text-xl font-black tracking-tight text-slate-900">{category.title}</h3>
        <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
          {category.description}
        </p>
      </div>
 
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4">
        <span className="text-[11px] font-black text-slate-400 transition-colors group-hover:text-slate-700">
          مشاهده و ورود
        </span>
 
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm text-white shadow-md transition-transform duration-300 group-hover:-translate-x-1 ${s.accent}`}
        >
          ←
        </span>
      </div>
    </InteractiveCard>
  );
}
 
/* =========================================================
   PAGE
========================================================= */
 
export default function GamesLobbyPage() {
  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#f5f7fa] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-200/25 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-48 top-[35%] h-[480px] w-[480px] rounded-full bg-violet-200/25 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-250px] right-[30%] h-[500px] w-[500px] rounded-full bg-lime-200/20 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>
 
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* NAVBAR */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] bg-[#111827] text-lg font-black text-white shadow-xl shadow-slate-900/10"
            >
              <span className="relative z-10">ت</span>
              <motion.div
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-8 rotate-[20deg] bg-white/15 blur-sm"
              />
            </motion.div>
 
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400">SPORTS PSYCHOLOGY</p>
              <p className="mt-0.5 text-sm font-black text-slate-800">تکل</p>
            </div>
          </Link>
 
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-black text-slate-500 shadow-sm backdrop-blur-xl transition hover:border-slate-300 hover:text-slate-900"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            صفحه اصلی
          </Link>
        </motion.header>
 
        <h1 className="sr-only">بخش‌های تمرین</h1>
 
        {/* BENTO GRID */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          <FeaturedCard category={categories[0]} />
          <SmallCard category={categories[1]} />
          <SmallCard category={categories[2]} />
          <SmallCard category={categories[3]} />
          <SmallCard category={categories[4]} />
          <SmallCard category={categories[5]} wide />
        </motion.section>
 
        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-center sm:flex-row"
        >
          <p className="text-[10px] font-bold text-slate-400">تکل • تمرین ذهن، عملکرد و رشد فردی</p>
 
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-lime-500"
            />
            آماده برای شروع
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
 