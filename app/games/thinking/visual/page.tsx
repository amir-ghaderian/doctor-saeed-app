"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lalezar, Vazirmatn } from "next/font/google";

const displayFont = Lalezar({ subsets: ["arabic", "latin"], weight: "400", variable: "--font-display", display: "swap" });
const bodyFont = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-body", display: "swap" });

/* ---------- تنظیمات تایمر تصویرک ---------- */
const FIRST_TIME_MS = 120000; // بار اولی که کاربر بازی می‌کند
const START_TIME_MS = 60000; // از بار دوم به بعد + هر بار شروع مجدد از چک‌پوینت + ستاره‌ها
const BONUS_MS = 5000;
const PENALTY_MS = 3000;
const REPLAY_COST_MS = 2000;

/* چک‌پوینت‌ها: مرحله ۱ → ۱ تا ۶ | مرحله ۷ → ۷ تا ۱۴ | مرحله ۱۵ → ۱۵ تا ۲۰ */
const STAGE_STARTS = [1, 7, 15] as const;

const L = (n: number, cards: number, unique: number, memorize: number) =>
  Array.from({ length: n }, () => ({ cards, unique, memorize }));

const LEVELS: { cards: number; unique: number; memorize: number }[] = [
  ...L(6, 3, 3, 10),
  ...L(2, 4, 3, 10),
  ...L(4, 4, 3, 11),
  ...L(4, 5, 3, 11),
  ...L(1, 5, 4, 11),
  ...L(1, 5, 4, 12),
  ...L(2, 6, 4, 12),
];

const BEST_KEY = "tasvirak-best-level";
const PLAYED_KEY = "tasvirak-played-before"; // آیا کاربر قبلاً بازی را شروع کرده؟
const MEMORY_KEY = "tasvirak-memory-metrics"; // نتیجهٔ کامل ۲۰ مرحلهٔ تصویرک
const STARS_KEY = "tasvirak-stars-metrics"; // نتیجهٔ کامل ۲۰ مرحلهٔ ستاره‌ها

const ANIMAL_SYMBOLS = ["🐮", "🐑", "🐰", "🐔", "🐴", "🐷", "🦊", "🐸", "🐵", "🐼"];
const VEHICLE_SYMBOLS = ["🚗", "🚕", "🚌", "🏎️", "🚲", "🚁", "✈️", "🚀"];

const NAMES: Record<string, string> = {
  "🐮": "گاو", "🐑": "گوسفند", "🐰": "خرگوش", "🐔": "مرغ", "🐴": "اسب",
  "🐷": "خوک", "🦊": "روباه", "🐸": "قورباغه", "🐵": "میمون", "🐼": "پاندا",
  "🚗": "ماشین", "🚕": "تاکسی", "🚌": "اتوبوس", "🏎️": "ماشین مسابقه",
  "🚲": "دوچرخه", "🚁": "هلیکوپتر", "✈️": "هواپیما", "🚀": "موشک",
};

const INK = "#111827";
const COLOR = { violet: "#7C3AED", yellow: "#FACC15", pink: "#EC4899", mint: "#10B981", sky: "#38BDF8", red: "#F43F5E" };
const DISPLAY: React.CSSProperties = { fontFamily: "var(--font-display), var(--font-body), Tahoma, sans-serif" };
const FOCUS = "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white";
const BORDER = "border-[3px] border-[#1E1B3A]";
const EXIT_BTN = `touch-manipulation flex h-14 shrink-0 items-center justify-center rounded-2xl ${BORDER} bg-[#FACC15] px-3 text-sm font-black text-[#111827] shadow-[3px_3px_0_#1E1B3A] transition active:translate-y-1 active:shadow-[1px_1px_0_#1E1B3A] ${FOCUS}`;
const TITLE_SHADOW = (px: number): React.CSSProperties => ({ ...DISPLAY, textShadow: `${px}px ${px}px 0 ${INK}` });

type Screen = "menu" | "tutorial" | "game" | "over" | "nextTest" | "stars" | "ball" | "final";
type Phase = "memorize" | "input" | "levelup";
type Flash = { id: number; kind: "good" | "bad"; amount: number };
type MemoryMetrics = {
  errors: number; replays: number; attempts: number; averageResponseMs: number; score: number;
};
// ستاره‌ها و مسیر توپ ساختار نتیجهٔ یکسانی دارند
type RoundsMetrics = {
  correct: number; wrong: number; answered: number;
  averageResponseMs: number; score: number; timedOut: boolean;
};
type StarsMetrics = RoundsMetrics;
type BallMetrics = RoundsMetrics;

function calculateMemoryScore({ errors, replays, averageResponseMs }: Pick<MemoryMetrics, "errors" | "replays" | "averageResponseMs">) {
  const base = averageResponseMs <= 1800 ? 100 : 98;
  const penalty = errors > 0 ? errors * (replays > 0 ? 6 : 4) : replays * 2;
  return Math.max(0, Math.min(100, Math.round(base - penalty)));
}

const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const formatSeconds = (ms: number) => `${toFa((ms / 1000).toFixed(1).replace(".0", "")).replace(".", "٫")} ثانیه`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const hasConsecutive = (seq: string[]) => seq.some((s, i) => i > 0 && s === seq[i - 1]);

const getStageStartLevel = (level: number) =>
  level >= STAGE_STARTS[2] ? STAGE_STARTS[2] : level >= STAGE_STARTS[1] ? STAGE_STARTS[1] : STAGE_STARTS[0];

function makeRound(level: number) {
  const safeLevel = Math.max(1, Math.min(level, LEVELS.length));
  const cfg = LEVELS[safeLevel - 1];
  const length = cfg.cards;
  const uniqueCount = Math.min(cfg.unique, length);

  let chosen: string[];
  if (safeLevel >= 15) {
    const vehicle = shuffle(VEHICLE_SYMBOLS)[0];
    const pool = [...shuffle(ANIMAL_SYMBOLS).slice(0, 6), ...shuffle(VEHICLE_SYMBOLS).slice(0, 2)];
    chosen = [vehicle, ...shuffle(pool.filter((s) => s !== vehicle))].slice(0, uniqueCount);
  } else {
    chosen = shuffle(ANIMAL_SYMBOLS).slice(0, uniqueCount);
  }

  let sequence: string[] = [];
  for (let attempt = 0; attempt < 300; attempt++) {
    const extra = Array.from({ length: length - uniqueCount }, () => chosen[Math.floor(Math.random() * chosen.length)]);
    sequence = shuffle([...chosen, ...extra]);
    if (!hasConsecutive(sequence)) break;
  }

  return { sequence, options: shuffle(chosen), memorizeMs: cfg.memorize * 1000 };
}

/* ---------- ابزارهای مشترک ---------- */

// لمس با pointerdown ثبت می‌شود (نه click): ضربهٔ سریع یا لغزش کم از دست نمی‌رود
const pointerTap = (fn: () => void) => (e: React.PointerEvent) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  fn();
};
// کیبورد (Enter/Space) با detail === 0
const tap = (fn: () => void) => ({
  onPointerDown: pointerTap(fn),
  onClick: (e: React.MouseEvent) => {
    if (e.detail === 0) fn();
  },
});

/* تایمر اصلی بازی: فقط ref را کم می‌کند و در لحظهٔ صفر شدن یک بار state می‌گذارد */
function useGameClock(startMs: number, startPaused = false) {
  const timeRef = useRef(startMs);
  const pausedRef = useRef(startPaused);
  const stopRef = useRef(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      if (pausedRef.current || stopRef.current) return;
      timeRef.current = Math.max(0, timeRef.current - dt);
      if (timeRef.current <= 0) {
        pausedRef.current = true;
        setTimeUp(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  return { timeRef, pausedRef, stopRef, timeUp, setTimeUp };
}

function useFlash() {
  const [flash, setFlash] = useState<Flash | null>(null);
  const idRef = useRef(0);

  const show = useCallback((kind: Flash["kind"], amount = 5) => {
    idRef.current += 1;
    setFlash({ id: idRef.current, kind, amount });
  }, []);
  const clear = useCallback(() => setFlash(null), []);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 1200);
    return () => clearTimeout(id);
  }, [flash]);

  return { flash, show, clear };
}

/* ---------- اجزای ساده UI ---------- */

function Panel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-3xl ${BORDER} bg-white p-4 shadow-[5px_5px_0_#1E1B3A] ${className}`} style={style}>
      {children}
    </div>
  );
}

function Chip({ children, bg, rotate = 0 }: { children: React.ReactNode; bg: string; rotate?: number }) {
  return (
    <span
      className={`inline-block rounded-full ${BORDER} px-3 py-1 text-xs font-black shadow-[2px_2px_0_#1E1B3A]`}
      style={{ backgroundColor: bg, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

function BigButton({ onClick, children, tone }: { onClick: () => void; children: React.ReactNode; tone: "yellow" | "white" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[3.25rem] w-full rounded-2xl ${BORDER} px-6 py-3 text-xl shadow-[0_5px_0_#1E1B3A] transition active:translate-y-1 active:shadow-[0_1px_0_#1E1B3A] ${FOCUS}`}
      style={{ ...DISPLAY, color: INK, backgroundColor: tone === "yellow" ? COLOR.yellow : "#ffffff" }}
    >
      {children}
    </button>
  );
}

type BtnProps = { onClick: () => void; children: React.ReactNode };
const PrimaryButton = (p: BtnProps) => <BigButton tone="yellow" {...p} />;
const SecondaryButton = (p: BtnProps) => <BigButton tone="white" {...p} />;

const TextLink = ({ onClick, children }: BtnProps) => (
  <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 text-sm font-bold text-white underline-offset-4 hover:underline ${FOCUS}`}>
    {children}
  </button>
);

function RuleRow({ icon, bg, children }: { icon: string; bg: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1B3A] text-lg" style={{ backgroundColor: bg }}>
        {icon}
      </span>
      <span className="pt-1 text-sm font-bold leading-6">{children}</span>
    </li>
  );
}

function TimerBar({ ms, flash, total = START_TIME_MS }: { ms: number; flash: Flash | null; total?: number }) {
  const sec = Math.ceil(ms / 1000);
  const pct = Math.max(0, Math.min(100, (ms / total) * 100));
  const good = flash?.kind === "good";
  const bad = flash?.kind === "bad";
  const low = ms <= 10000;

  const pillBg = good ? COLOR.mint : bad ? COLOR.red : low ? COLOR.pink : "#ffffff";
  const barBg = good ? COLOR.mint : bad || low ? COLOR.red : COLOR.sky;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <motion.div
          key={flash ? flash.id : "idle"}
          animate={{ scale: flash ? [1, 1.18, 1] : 1 }}
          transition={{ duration: 0.4 }}
          role="timer"
          aria-label={`${sec} ثانیه`}
          className={`flex h-14 min-w-[5.5rem] items-center justify-center gap-1 rounded-2xl ${BORDER} px-3 shadow-[3px_3px_0_#1E1B3A] transition-colors ${low && !flash ? "motion-safe:animate-pulse" : ""}`}
          style={{ backgroundColor: pillBg, color: bad ? "#ffffff" : INK }}
        >
          <span className="text-4xl leading-none tabular-nums" style={DISPLAY}>{toFa(sec)}</span>
          <span className="text-[10px] font-black">ثانیه</span>
        </motion.div>

        <div className="pointer-events-none absolute right-0 top-full z-10 mt-2">
          <AnimatePresence>
            {flash && (
              <motion.span
                key={flash.id}
                initial={{ opacity: 0, y: -6, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                className={`inline-block rounded-full ${BORDER} px-3 py-0.5 text-lg shadow-[2px_2px_0_#1E1B3A]`}
                style={{ ...DISPLAY, backgroundColor: good ? COLOR.mint : COLOR.red, color: good ? INK : "#ffffff" }}
              >
                {good ? "+" : "−"}{toFa(flash.amount)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`h-7 flex-1 overflow-hidden rounded-full ${BORDER} bg-white shadow-[3px_3px_0_#1E1B3A]`}>
        <div
          className="h-full rounded-full transition-[width,background-color] duration-200 ease-linear"
          style={{ width: `${pct}%`, backgroundColor: barBg }}
        />
      </div>
    </div>
  );
}

/* تایمر زنده: فقط همین کامپوننت هر ۲۰۰ میلی‌ثانیه رندر می‌شود، نه کل بازی */
function LiveTimer({ timeRef, flash, total }: { timeRef: React.MutableRefObject<number>; flash: Flash | null; total?: number }) {
  const [ms, setMs] = useState(timeRef.current);

  useEffect(() => {
    const id = setInterval(() => setMs(timeRef.current), 200);
    return () => clearInterval(id);
  }, [timeRef]);

  useEffect(() => setMs(timeRef.current), [flash, timeRef]);

  return <TimerBar ms={ms} flash={flash} total={total} />;
}

// نوار هدر مشترک هر سه بازی: تایمر + خروج + دو چیپ مرحله
function GameHeader({ timeRef, flash, total, onExit, stage, tag }: {
  timeRef: React.MutableRefObject<number>; flash: Flash | null; total?: number;
  onExit: () => void; stage: string; tag: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1"><LiveTimer timeRef={timeRef} flash={flash} total={total} /></div>
        <button type="button" onClick={onExit} className={EXIT_BTN} aria-label="خروج از بازی">خروج</button>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Chip bg={COLOR.yellow} rotate={-2}>{stage}</Chip>
        <Chip bg="#ffffff" rotate={2}>{tag}</Chip>
      </div>
    </div>
  );
}

// نوار شمارش معکوس (با scaleX فقط روی GPU)
function CountdownBar({ id, durationMs }: { id: string; durationMs: number }) {
  return (
    <div className="mt-3 h-3">
      <div className="h-3 overflow-hidden rounded-full border-2 border-[#1E1B3A] bg-white">
        <motion.div
          key={id}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
          className="h-full w-full rounded-full"
          style={{ backgroundColor: COLOR.violet, transformOrigin: "right" }}
        />
      </div>
    </div>
  );
}

// صفحهٔ قوانین مشترک ستاره‌ها و مسیر توپ
function Intro({ icon, title, onStart, onBack, children }: {
  icon: string; title: string; onStart: () => void; onBack: () => void; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 select-none flex-col gap-5 py-4">
      <div className="flex flex-1 flex-col justify-center gap-5">
        <div className="text-center">
          <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${BORDER} bg-[#FFD43B] text-5xl shadow-[4px_4px_0_#1E1B3A]`} aria-hidden>{icon}</div>
          <h1 className="mt-4 text-5xl leading-none text-white" style={TITLE_SHADOW(3)}>{title}</h1>
        </div>
        <Panel>
          <h2 className="text-2xl" style={DISPLAY}>قانون‌های بازی</h2>
          <ul className="mt-4 space-y-3">{children}</ul>
        </Panel>
      </div>
      <div className="space-y-3 pb-1">
        <PrimaryButton onClick={onStart}>شروع بازی</PrimaryButton>
        <div className="text-center"><TextLink onClick={onBack}>← بازگشت</TextLink></div>
      </div>
    </div>
  );
}

function TimeUpOverlay() {
  return (
    <motion.div
      role="alertdialog"
      aria-label="زمان تمام شد"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      style={{ backgroundColor: "rgba(11,16,32,0.92)" }}
    >
      <Panel className="w-full max-w-sm text-center" style={{ backgroundColor: "#FFFDF5", boxShadow: "7px 7px 0 #1E1B3A" }}>
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${BORDER} bg-[#FFD43B] text-4xl shadow-[4px_4px_0_#1E1B3A]`}>⏰</div>
        <h2 className="mt-4 text-4xl" style={DISPLAY}>وقت تموم شد!</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">کارنامه‌ات داره آماده می‌شه…</p>
      </Panel>
    </motion.div>
  );
}

function FlipCard({ symbol, faceUp, count, success = false, hero = false, delay = 0 }: {
  symbol: string; faceUp: boolean; count: number; success?: boolean; hero?: boolean; delay?: number;
}) {
  const fs = hero ? "text-5xl" : count > 7 ? "text-xl" : count > 5 ? "text-3xl" : "text-4xl";
  const edge = count > 6
    ? "rounded-lg border-2 shadow-[2px_2px_0_#1E1B3A]"
    : `rounded-2xl ${BORDER} shadow-[3px_3px_0_#1E1B3A]`;
  const face: React.CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

  return (
    <div className={hero ? "relative aspect-[3/4] w-24" : "relative aspect-[3/4] w-full"} style={{ perspective: 700 }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ duration: 0.45, delay }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center border-[#1E1B3A] ${edge} ${fs}`}
          style={{
            ...face, ...DISPLAY, color: INK,
            background: `repeating-linear-gradient(45deg, ${COLOR.yellow} 0 7px, #FFC21A 7px 14px)`,
          }}
        >
          ؟
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center border-[#1E1B3A] ${edge} ${fs}`}
          style={{ ...face, transform: "rotateY(180deg)", backgroundColor: success ? COLOR.mint : "#ffffff" }}
        >
          {symbol}
        </div>
      </motion.div>
    </div>
  );
}

function CardRow({ sequence, revealAll, filled, success, roundKey }: {
  sequence: string[]; revealAll: boolean; filled: number; success?: boolean; roundKey: number;
}) {
  const count = sequence.length;
  return (
    <div dir="ltr" className={`flex w-full flex-nowrap items-center justify-center ${count > 6 ? "gap-1" : count > 4 ? "gap-1.5" : "gap-2.5"}`}>
      {sequence.map((sym, i) => (
        <motion.div
          key={`${roundKey}-${i}`}
          initial={{ opacity: 0, y: 18, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="min-w-0 max-w-[4.75rem] flex-1"
        >
          <FlipCard symbol={sym} faceUp={revealAll || i < filled} count={count} success={success} />
        </motion.div>
      ))}
    </div>
  );
}

function Options({ options, onPick, disabled, hint }: {
  options: string[]; onPick: (s: string) => void; disabled: boolean; hint?: string | null;
}) {
  const reduce = useReducedMotion();
  const cols = options.length <= 4 ? options.length : Math.ceil(options.length / 2);

  return (
    <div
      className="mx-auto grid w-full gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: `${cols * 5.75}rem` }}
    >
      {options.map((sym) => {
        const hinted = hint === sym;
        const pulse = hinted && !reduce;
        return (
          <motion.button
            key={sym}
            type="button"
            disabled={disabled}
            {...tap(() => onPick(sym))}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            animate={pulse ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={pulse ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
            aria-label={NAMES[sym] ?? sym}
            // before: ناحیهٔ لمس نامرئی ۶px در هر طرف که فاصلهٔ بین دکمه‌ها را پر می‌کند
            className={`relative touch-manipulation aspect-square w-full rounded-2xl ${BORDER} text-4xl shadow-[0_4px_0_#1E1B3A] transition-colors before:absolute before:-inset-1.5 before:content-[''] ${FOCUS}`}
            style={{ backgroundColor: hinted ? COLOR.yellow : "#ffffff", opacity: disabled ? 0.55 : 1 }}
          >
            {sym}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------- بازی تصویرک ---------- */

function Game({ onOver, onExit, initialLevel, startMs }: {
  onOver: (completedLevels: number, won?: boolean, metrics?: MemoryMetrics) => void;
  onExit: () => void;
  initialLevel: number;
  startMs: number; // ۱۲۰ ثانیه بار اول، ۶۰ ثانیه از بار دوم
}) {
  const [level, setLevel] = useState(initialLevel);
  const [round, setRound] = useState(() => makeRound(initialLevel));
  const [phase, setPhase] = useState<Phase>("memorize");
  const [replays, setReplays] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [restartLevel, setRestartLevel] = useState<number | null>(null);
  const [barTotal, setBarTotal] = useState(startMs); // مبنای نوار تایمر

  const { flash, show, clear } = useFlash();
  const { timeRef, pausedRef, stopRef, timeUp, setTimeUp } = useGameClock(startMs);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsRef = useRef({ errors: 0, replays: 0, attempts: 0, totalResponseMs: 0 });
  const lastPickAtRef = useRef(Date.now());

  const timeoutModal = restartLevel !== null;

  // پایان زمان: محاسبهٔ چک‌پوینت و نمایش پیام
  useEffect(() => {
    if (!timeUp || timeoutModal || stopRef.current) return;
    setModal(false);
    clear();
    setRestartLevel(getStageStartLevel(level));
  }, [timeUp, timeoutModal, level, clear, stopRef]);

  // پایان مرحلهٔ حفظ کردن
  useEffect(() => {
    if (phase !== "memorize" || timeoutModal) return;
    const id = setTimeout(() => {
      if (stopRef.current) return;
      lastPickAtRef.current = Date.now();
      setPhase("input");
    }, round.memorizeMs);
    return () => clearTimeout(id);
  }, [phase, round.memorizeMs, timeoutModal, stopRef]);

  const closeModal = useCallback(() => {
    setModal(false);
    setPicked([]);
    lastPickAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!modal) return;
    const id = setTimeout(closeModal, 1400);
    return () => clearTimeout(id);
  }, [modal, closeModal]);

  useEffect(() => () => {
    if (nextTimer.current) clearTimeout(nextTimer.current);
  }, []);

  const handleExit = () => {
    if (stopRef.current) return;
    stopRef.current = true;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    onExit();
  };

  // ادامه بعد از پایان تایمر: از چک‌پوینت همان استیج با ۶۰ ثانیه تازه
  const handleTimeoutContinue = () => {
    if (restartLevel === null || stopRef.current) return;
    const lv = restartLevel;
    timeRef.current = START_TIME_MS;
    pausedRef.current = false;
    setBarTotal(START_TIME_MS);
    setTimeUp(false);
    setRestartLevel(null);
    setModal(false);
    clear();
    setLevel(lv);
    setRound(makeRound(lv));
    setPicked([]);
    setReplays(0);
    setPhase("memorize");
  };

  const handlePick = (sym: string) => {
    if (phase !== "input" || modal || timeoutModal || stopRef.current) return;

    const now = Date.now();
    statsRef.current.attempts += 1;
    statsRef.current.totalResponseMs += Math.max(0, Math.min(10000, now - lastPickAtRef.current));
    lastPickAtRef.current = now;

    if (sym === round.sequence[picked.length]) {
      const next = [...picked, sym];
      setPicked(next);
      if (next.length !== round.sequence.length) return;

      setPhase("levelup");
      timeRef.current += BONUS_MS;
      show("good");

      nextTimer.current = setTimeout(() => {
        if (stopRef.current) return;
        if (level >= LEVELS.length) {
          const { errors, replays: rp, attempts, totalResponseMs } = statsRef.current;
          const averageResponseMs = attempts > 0 ? totalResponseMs / attempts : 0;
          onOver(level, true, {
            errors, replays: rp, attempts, averageResponseMs,
            score: calculateMemoryScore({ errors, replays: rp, averageResponseMs }),
          });
          return;
        }
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setRound(makeRound(nextLevel));
        setPicked([]);
        setReplays(0);
        setPhase("memorize");
      }, 1100);
    } else {
      statsRef.current.errors += 1;
      timeRef.current = Math.max(0, timeRef.current - PENALTY_MS);
      show("bad");
      setModal(true);
    }
  };

  const canReplay = phase === "input" && !modal && !timeoutModal && !stopRef.current && timeRef.current > REPLAY_COST_MS;

  const handleReplay = () => {
    if (!canReplay) return;
    statsRef.current.replays += 1;
    timeRef.current = Math.max(0, timeRef.current - REPLAY_COST_MS);
    show("bad", REPLAY_COST_MS / 1000);
    setReplays((r) => r + 1);
    setPhase("memorize");
  };

  const handleKnowIt = () => {
    if (phase !== "memorize" || timeoutModal || stopRef.current) return;
    lastPickAtRef.current = Date.now();
    setPhase("input");
  };

  const total = round.sequence.length;
  const statusText =
    phase === "memorize" ? "کارت‌ها رو با ترتیبشون حفظ کن"
    : phase === "input" ? `به همون ترتیب بزن (${toFa(picked.length)} از ${toFa(total)})`
    : "آفرین! درست بود ✔";

  const sideBtn =
    `touch-manipulation flex min-h-[4.75rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl ${BORDER} px-1 text-center shadow-[0_4px_0_#1E1B3A] transition enabled:active:translate-y-1 enabled:active:shadow-[0_1px_0_#1E1B3A] disabled:opacity-50 ` + FOCUS;

  return (
    <div className="flex flex-1 select-none flex-col gap-4">
      <GameHeader
        timeRef={timeRef}
        flash={flash}
        total={barTotal}
        onExit={handleExit}
        stage={`مرحله ${toFa(level)} از ${toFa(LEVELS.length)}`}
        tag={`${toFa(total)} کارت`}
      />

      <div className="flex flex-1 flex-col justify-center gap-3">
        <p className="text-center text-xl" style={{ ...DISPLAY, color: phase === "levelup" ? COLOR.mint : "#ffffff" }} aria-live="polite">
          {statusText}
        </p>

        <Panel className="!p-3 transition-colors" style={{ backgroundColor: phase === "levelup" ? "#D1FAE5" : "#ffffff" }}>
          <CardRow
            sequence={round.sequence}
            revealAll={phase === "memorize"}
            filled={phase === "levelup" ? total : picked.length}
            success={phase === "levelup"}
            roundKey={level}
          />
          {phase === "memorize" ? (
            <CountdownBar id={`${level}-${replays}`} durationMs={round.memorizeMs} />
          ) : (
            <div className="mt-3 h-3" />
          )}
        </Panel>
      </div>

      <Panel className="mb-1 !p-3">
        <div className="flex items-stretch gap-3">
          <div className="flex w-[5.5rem] shrink-0 flex-col gap-3">
            <button type="button" onClick={handleReplay} disabled={!canReplay} className={sideBtn} style={{ backgroundColor: COLOR.sky }}>
              <span className="text-lg leading-none">👁️</span>
              <span className="text-[11px] font-black leading-tight">دوباره نشونم بده</span>
              <span className="text-[10px] font-black">−{toFa(REPLAY_COST_MS / 1000)} ثانیه</span>
            </button>

            <button type="button" onClick={handleKnowIt} disabled={phase !== "memorize" || timeoutModal} className={sideBtn} style={{ backgroundColor: COLOR.yellow }}>
              <span className="text-lg leading-none">✅</span>
              <span className="text-base leading-tight" style={DISPLAY}>حفظ کردم</span>
            </button>
          </div>

          <div className="flex min-w-0 flex-1 items-center">
            <Options options={round.options} onPick={handlePick} disabled={phase !== "input" || modal || timeoutModal} />
          </div>
        </div>
      </Panel>

      {/* خطای انتخاب اشتباه */}
      <AnimatePresence>
        {modal && !timeoutModal && (
          <motion.div
            key="wrong"
            role="alertdialog"
            aria-label="اشتباه بود"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center px-6"
            style={{
              backgroundColor: COLOR.red,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 2px, transparent 2px)",
              backgroundSize: "22px 22px",
            }}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4 }}
              animate={{ scale: 1, rotate: 0, x: [0, -10, 10, -6, 6, 0] }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xs text-center"
            >
              <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${BORDER} bg-white text-5xl shadow-[4px_4px_0_#1E1B3A]`}>✖</div>
              <h2 className="mt-5 text-5xl text-white" style={TITLE_SHADOW(3)}>اشتباه بود!</h2>
              <div className={`mt-5 inline-block rounded-2xl ${BORDER} bg-white px-5 py-2 text-2xl shadow-[3px_3px_0_#1E1B3A]`} style={{ ...DISPLAY, color: INK }}>
                −{toFa(PENALTY_MS / 1000)} ثانیه
              </div>
              <p className="mt-4 text-sm font-bold text-white">دوباره از اول همین مرحله بچین</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* پایان زمان و بازگشت به چک‌پوینت */}
      <AnimatePresence>
        {timeoutModal && (
          <motion.div
            key="timeout"
            role="alertdialog"
            aria-label="زمان تمام شد"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-5"
            style={{ backgroundColor: "rgba(11,16,32,0.92)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.88, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm"
            >
              <Panel className="overflow-hidden !p-0" style={{ backgroundColor: "#FFFDF5", boxShadow: "7px 7px 0 #1E1B3A" }}>
                <div className="relative px-5 pb-6 pt-7 text-center" dir="rtl">
                  <div
                    className="absolute left-0 right-0 top-0 h-3"
                    style={{ background: `linear-gradient(90deg, ${COLOR.violet}, ${COLOR.pink}, ${COLOR.yellow})` }}
                  />

                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-[#1E1B3A] bg-[#FFD43B] text-5xl shadow-[4px_4px_0_#1E1B3A]"
                  >
                    ⏰
                  </motion.div>

                  <div className="mt-6">
                    <h2 className="text-4xl leading-tight" style={DISPLAY}>این بار نشد! 😅</h2>
                    <p className="mt-3 text-xl" style={{ ...DISPLAY, color: COLOR.violet }}>دوباره امتحان کن</p>

                    <p className="mx-auto mt-4 max-w-[18rem] text-sm font-bold leading-7 text-slate-600">
                      زمانت تموم شد، اما چیزی از دست نرفته.
                      <br />
                      از چک‌پوینت قبلی دوباره شروع می‌کنی و <b>{toFa(START_TIME_MS / 1000)} ثانیه</b> زمان تازه داری.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                      <Chip bg={COLOR.yellow} rotate={-2}>↺ شروع از مرحله {toFa(restartLevel ?? 1)}</Chip>
                      <Chip bg={COLOR.sky} rotate={2}>⏱️ {toFa(START_TIME_MS / 1000)} ثانیه تازه</Chip>
                    </div>

                    <p className="mt-4 text-xs font-black text-slate-500">این بار با تمرکز بیشتر بزن بریم! 💪</p>

                    <div className="mt-6"><PrimaryButton onClick={handleTimeoutContinue}>بزن بریم 🚀</PrimaryButton></div>
                    <div className="mt-3"><TextLink onClick={handleExit}>خروج از بازی</TextLink></div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- آموزش ---------- */

const TUT_SEQ = ["🐮", "🐑", "🐰"];
const TUT_OPTIONS = ["🐰", "🐮", "🐑"];

function Tutorial({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [warns, setWarns] = useState(0);
  const [warn, setWarn] = useState(false);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!warn) return;
    const id = setTimeout(() => setWarn(false), 2000);
    return () => clearTimeout(id);
  }, [warn]);

  useEffect(() => () => {
    if (doneTimer.current) clearTimeout(doneTimer.current);
  }, []);

  const restart = () => {
    setStep(0);
    setPicked([]);
    setWarn(false);
  };

  const handlePick = (sym: string) => {
    if (step !== 2) return;
    if (sym === TUT_SEQ[picked.length]) {
      const next = [...picked, sym];
      setPicked(next);
      if (next.length === TUT_SEQ.length) doneTimer.current = setTimeout(() => setStep(3), 700);
    } else {
      setWarns((w) => w + 1);
      setWarn(true);
      setPicked([]);
    }
  };

  const timerMs = step === 3 ? START_TIME_MS + BONUS_MS : warn ? START_TIME_MS - PENALTY_MS : START_TIME_MS;
  const timerFlash: Flash | null =
    step === 3 ? { id: 1000, kind: "good", amount: 5 }
    : warn ? { id: warns, kind: "bad", amount: PENALTY_MS / 1000 }
    : null;
  const expected = step === 2 ? TUT_SEQ[picked.length] : null;

  return (
    <div className="flex flex-1 select-none flex-col gap-5">
      <div>
        <TimerBar ms={timerMs} flash={timerFlash} />
        <div className="mt-4 flex items-center justify-center gap-2" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-3 w-3 rounded-full border-2 border-[#1E1B3A]" style={{ backgroundColor: i <= step ? COLOR.yellow : "#ffffff" }} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-5">
        <Panel>
          {step === 0 && (
            <div>
              <h2 className="text-2xl" style={DISPLAY}>قانون‌های بازی</h2>
              <ul className="mt-4 space-y-3">
                <RuleRow icon="⏱️" bg={COLOR.sky}>بار اول {toFa(FIRST_TIME_MS / 1000)} ثانیه وقت داری و از دفعهٔ بعد {toFa(START_TIME_MS / 1000)} ثانیه؛ حتی زمان دیدن و حفظ کردن کارت‌ها هم از تایمر کم می‌شود.</RuleRow>
                <RuleRow icon="👀" bg={COLOR.yellow}>چند کارت نشونت می‌دیم؛ ترتیبشون رو حفظ کن.</RuleRow>
                <RuleRow icon="👆" bg={COLOR.pink}>بعد نمادها رو به همون ترتیب از پایین انتخاب کن.</RuleRow>
                <RuleRow icon="✅" bg={COLOR.mint}>درست بزنی {toFa(BONUS_MS / 1000)} ثانیه اضافه می‌شه.</RuleRow>
                <RuleRow icon="❌" bg={COLOR.red}>اشتباه بزنی {toFa(PENALTY_MS / 1000)} ثانیه کم می‌شه.</RuleRow>
                <RuleRow icon="👁️" bg="#A78BFA">یادت رفت؟ «دوباره نشونم بده» کارت‌ها رو دوباره نشون می‌ده و {toFa(REPLAY_COST_MS / 1000)} ثانیه کم می‌کنه.</RuleRow>
              </ul>
            </div>
          )}

          {step === 1 && (
            <p className="text-sm font-bold leading-7">
              این ۳ کارت رو به ترتیب ببین: اول <b>{NAMES[TUT_SEQ[0]]}</b>، بعد <b>{NAMES[TUT_SEQ[1]]}</b>، بعد <b>{NAMES[TUT_SEQ[2]]}</b>
            </p>
          )}

          {step === 2 && (
            <p className="text-sm font-bold leading-7">
              حالا از پایین همون ترتیب رو بزن. الان نوبت <b>{expected} {expected ? NAMES[expected] : ""}</b> ست.
            </p>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl" style={{ ...DISPLAY, color: "#059669" }}>آفرین، درست بود! 🎉</h2>
              <p className="mt-2 text-sm font-bold leading-7">
                دیدی؟ تایمر سبز شد و {toFa(5)} ثانیه اضافه شد. بازی از چند کارت ساده شروع می‌شود و خیلی آرام سخت‌تر می‌شود.
              </p>
            </div>
          )}
        </Panel>

        {(step === 1 || step === 2) && (
          <Panel className="!p-3">
            <CardRow sequence={TUT_SEQ} revealAll={step === 1} filled={picked.length} roundKey={0} />
          </Panel>
        )}

        {step === 2 && (
          <div>
            <Panel>
              <Options options={TUT_OPTIONS} onPick={handlePick} disabled={false} hint={expected} />
            </Panel>

            <AnimatePresence>
              {warn && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 rounded-2xl ${BORDER} px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#1E1B3A]`}
                  style={{ backgroundColor: COLOR.red }}
                >
                  اشتباه شد! تو بازی اصلی {toFa(PENALTY_MS / 1000)} ثانیه کم می‌شه. دوباره از اول بزن.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="space-y-3 pb-1">
        {step === 0 && <PrimaryButton onClick={() => setStep(1)}>بریم سراغ یه تمرین</PrimaryButton>}
        {step === 1 && <PrimaryButton onClick={() => setStep(2)}>حفظ کردم</PrimaryButton>}
        {step === 3 && (
          <>
            <PrimaryButton onClick={onStart}>شروع بازی</PrimaryButton>
            <SecondaryButton onClick={restart}>تکرار آموزش</SecondaryButton>
          </>
        )}
        {step < 3 && <div className="text-center"><TextLink onClick={onBack}>رد کردن آموزش</TextLink></div>}
      </div>
    </div>
  );
}

/* ---------- صفحه‌های جانبی ---------- */

function HeroFan() {
  const reduce = useReducedMotion();
  const [up, setUp] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setUp(true), 600);
    return () => clearTimeout(id);
  }, []);

  const cards = [{ s: "🐮", r: -10 }, { s: "🐑", r: 0 }, { s: "🐰", r: 10 }];

  return (
    <div dir="ltr" className="flex items-end justify-center" aria-hidden>
      {cards.map((c, i) => (
        <motion.div
          key={c.s}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
          className="-mx-1.5"
          style={{ rotate: c.r, marginBottom: i === 1 ? 14 : 0 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 + 1 }}
          >
            <FlipCard hero symbol={c.s} faceUp={up} count={3} delay={i * 0.15} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function DoctorNextTest({ metrics, onStartStars, onBack }: { metrics: MemoryMetrics; onStartStars: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="w-full max-w-md">
        <Panel className="relative !p-5 sm:!p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: `6px 6px 0 ${INK}` }}>
          <div className="flex flex-col items-center">
            <div className="relative flex w-full flex-col items-center">
              <div
                className="relative z-10 h-28 w-28 overflow-hidden rounded-full border-[4px] border-[#1E1B3A] bg-[#D6FFF0] shadow-[4px_4px_0_#1E1B3A]"
                aria-label="تصویر دکتر"
              >
                <img src="/pic/drHead.png" alt="دکتر سعید" className="h-full w-full object-cover object-top" />
              </div>

              <div className={`relative mt-5 w-full rounded-[2rem] ${BORDER} bg-[#FFF7C2] px-5 py-5 text-right shadow-[4px_4px_0_#1E1B3A]`} dir="rtl">
                <div
                  className="absolute -top-4 left-1/2 h-7 w-7 -translate-x-1/2 rotate-45 border-l-[3px] border-t-[3px] border-[#1E1B3A] bg-[#FFF7C2]"
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-2xl leading-9" style={DISPLAY}>آفرین! 🎉</p>
                  <p className="mt-3 text-sm font-bold leading-7">امتیاز حافظه‌ات در این تست شد:</p>

                  <div className="my-4 flex items-center justify-center gap-3">
                    <span className="text-6xl leading-none" style={{ ...DISPLAY, color: COLOR.violet }}>{toFa(metrics.score)}</span>
                    <span className="text-xl font-black" style={DISPLAY}>از ۱۰۰</span>
                  </div>

                  <p className="text-sm font-bold leading-7">
                    این امتیاز بر اساس <b>سرعت انتخاب‌ها</b>، تعداد <b>خطاها</b> و دفعات <b>نمایش دوباره</b> محاسبه شده.
                    <br />
                    حالا بریم ببینیم در تست‌های بعدی چه عملکردی داری.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid w-full grid-cols-3 gap-2">
              <Chip bg={COLOR.yellow} rotate={-1}>🧠 امتیاز {toFa(metrics.score)}</Chip>
              <Chip bg={COLOR.pink}>❌ خطا {toFa(metrics.errors)}</Chip>
              <Chip bg={COLOR.sky} rotate={1}>👁️ نمایش دوباره {toFa(metrics.replays)}</Chip>
            </div>

            <p className="mt-3 text-xs font-bold text-slate-500">میانگین زمان پاسخ: {formatSeconds(metrics.averageResponseMs)}</p>
          </div>
        </Panel>

        <div className="mt-7 w-full space-y-3">
          <PrimaryButton onClick={onStartStars}>⭐ شروع بازی ستاره‌ها</PrimaryButton>
          <SecondaryButton onClick={onBack}>← بازگشت به منوی بازی‌ها</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

/* ---------- منطق مشترک ستاره‌ها و مسیر توپ ---------- */

function buildRoundsMetrics(
  s: { correct: number; wrong: number; answered: number; totalMs: number; points: number },
  rounds: number,
  timedOut: boolean
): RoundsMetrics {
  return {
    correct: s.correct,
    wrong: s.wrong,
    answered: s.answered,
    averageResponseMs: s.answered ? s.totalMs / s.answered : 0,
    score: Math.min(100, Math.round((s.points * 100) / (rounds * 10))),
    timedOut: timedOut && s.answered < rounds,
  };
}

/* ---------- بازی ستاره‌ها ---------- */

const STARS_ROUNDS = 20;
const STARS_SHOW_MS = 3000;
const STARS_FEEDBACK_MS = 1200;
const STARS_BONUS_MS = 5000;
const STARS_PENALTY_MS = 5000;
// بازهٔ تعداد ستاره‌ها در هر مرحله (کم‌کم سخت‌تر می‌شود)
const STARS_RANGES: [number, number][] = [
  [2, 4], [3, 5], [4, 6], [5, 7], [5, 8], [6, 9], [7, 10], [8, 11], [9, 12], [10, 14],
  [4, 6], [5, 7], [5, 8], [6, 9], [6, 10], [7, 10], [7, 11], [8, 11], [8, 12], [9, 13],
];
// تعداد ماه‌های مزاحم در هر مرحله (۱۰ مرحلهٔ اول بدون ماه)
const MOON_RANGES: [number, number][] = [
  ...Array.from({ length: 10 }, () => [0, 0] as [number, number]),
  [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6], [5, 7], [6, 7], [6, 8],
];
const STAR_SHAPE = "50,4 61.8,36.5 96.5,38 69.4,59.5 78.8,93 50,74 21.2,93 30.6,59.5 3.5,38 38.2,36.5";
const MOON_SHAPE = "M60 6 A46 46 0 1 0 94 64 A40 40 0 0 1 60 6 Z";
const STRIPES = `repeating-linear-gradient(45deg, ${COLOR.yellow} 0 7px, #FFC21A 7px 14px)`;

type StarsPhase = "intro" | "show" | "answer" | "feedback";
type StarItem = { x: number; y: number; s: number; r: number; kind: "star" | "moon" };

/*
  امتیاز هر مرحله (حداکثر ۱۰ → مجموع ۲۰۰ که به مقیاس ۱۰۰ برگردانده می‌شود):
  - جواب درست: ۶ امتیاز دقت + تا ۴ امتیاز سرعت (≤۱.۵ث: ۴ | ≤۲.۵ث: ۳ | ≤۴ث: ۲ | ≤۶ث: ۱)
  - جواب غلط ولی فقط یکی کم/زیاد: ۲ امتیاز
  - غلط‌تر یا بی‌پاسخ: صفر
*/
function starPoints(ok: boolean, diff: number, ms: number) {
  if (ok) return 6 + (ms <= 1500 ? 4 : ms <= 2500 ? 3 : ms <= 4000 ? 2 : ms <= 6000 ? 1 : 0);
  return Math.abs(diff) === 1 ? 2 : 0;
}

function makeStarOptions(correct: number) {
  const set = new Set<number>([correct]);
  for (const n of shuffle([-2, -1, 1, 2, 3, -3].map((d) => correct + d).filter((n) => n >= 1))) {
    if (set.size >= 4) break;
    set.add(n);
  }
  for (let n = correct + 4; set.size < 4; n++) set.add(n);
  return [...set].sort((a, b) => a - b);
}

function makeStarsRound(i: number) {
  const [lo, hi] = STARS_RANGES[i];
  const [mlo, mhi] = MOON_RANGES[i];
  const count = lo + Math.floor(Math.random() * (hi - lo + 1));
  const moonCount = mlo + Math.floor(Math.random() * (mhi - mlo + 1));
  const total = count + moonCount;
  const W = 100, H = 75; // مساحت ۴:۳ بر حسب «درصد عرض»
  const dense = total > 10;
  let gap = total > 16 ? 11 : dense ? 14 : 17;
  const kinds = shuffle<"star" | "moon">([
    ...Array.from({ length: count }, () => "star" as const),
    ...Array.from({ length: moonCount }, () => "moon" as const),
  ]);
  const stars: StarItem[] = [];

  for (let k = 0; k < total; k++) {
    for (let tries = 1; ; tries++) {
      if (tries % 150 === 0) gap *= 0.9; // اگر جا پیدا نشد، فاصلهٔ حداقل کم‌کم کمتر می‌شود
      const s = (dense ? 9 : 11) + Math.random() * 3;
      const x = s / 2 + 2 + Math.random() * (W - s - 4);
      const y = s / 2 + 2 + Math.random() * (H - s - 4);
      if (stars.every((o) => Math.hypot(o.x - x, o.y - y) >= gap)) {
        stars.push({ x, y, s, r: Math.round(Math.random() * 40 - 20), kind: kinds[k] });
        break;
      }
    }
  }

  return { count, stars, options: makeStarOptions(count) };
}

function StarsGame({ onFinish, onExit }: { onFinish: (m: StarsMetrics) => void; onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(() => makeStarsRound(0));
  const [phase, setPhase] = useState<StarsPhase>("intro");
  const [chosen, setChosen] = useState<number | null>(null);

  const { flash, show, clear } = useFlash();
  const { timeRef, pausedRef, stopRef, timeUp } = useGameClock(START_TIME_MS, true); // تا زدن «شروع» متوقف است
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerStartRef = useRef(0);
  const statsRef = useRef({ correct: 0, wrong: 0, answered: 0, totalMs: 0, points: 0 });
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const finish = useCallback((timedOut: boolean) => {
    if (stopRef.current) return;
    stopRef.current = true;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    finishRef.current(buildRoundsMetrics(statsRef.current, STARS_ROUNDS, timedOut));
  }, [stopRef]);

  // پایان زمان: مکث کوتاه و رفتن به کارنامه
  useEffect(() => {
    if (!timeUp || stopRef.current) return;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    clear();
    const id = setTimeout(() => finish(true), 1600);
    return () => clearTimeout(id);
  }, [timeUp, finish, clear, stopRef]);

  // پایان نمایش ستاره‌ها → نمایش گزینه‌ها
  useEffect(() => {
    if (phase !== "show" || timeUp) return;
    const id = setTimeout(() => {
      answerStartRef.current = Date.now();
      setPhase("answer");
    }, STARS_SHOW_MS);
    return () => clearTimeout(id);
  }, [phase, timeUp, idx]);

  useEffect(() => () => {
    if (nextTimer.current) clearTimeout(nextTimer.current);
  }, []);

  const handleStart = () => {
    pausedRef.current = false;
    setPhase("show");
  };

  const handleExit = () => {
    if (stopRef.current) return;
    stopRef.current = true;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    onExit();
  };

  const handlePick = (n: number) => {
    if (phase !== "answer" || timeUp || stopRef.current) return;

    const ms = Math.max(0, Math.min(10000, Date.now() - answerStartRef.current));
    const ok = n === round.count;
    const s = statsRef.current;
    s.answered += 1;
    s.totalMs += ms;
    s.points += starPoints(ok, n - round.count, ms);

    if (ok) {
      s.correct += 1;
      timeRef.current += STARS_BONUS_MS;
    } else {
      s.wrong += 1;
      timeRef.current = Math.max(0, timeRef.current - STARS_PENALTY_MS);
    }

    show(ok ? "good" : "bad");
    setChosen(n);
    setPhase("feedback");

    nextTimer.current = setTimeout(() => {
      if (stopRef.current) return;
      if (idx >= STARS_ROUNDS - 1) {
        finish(false);
        return;
      }
      const next = idx + 1;
      setIdx(next);
      setRound(makeStarsRound(next));
      setChosen(null);
      setPhase("show");
    }, STARS_FEEDBACK_MS);
  };

  if (phase === "intro") {
    return (
      <Intro icon="⭐" title="بازی ستاره‌ها" onStart={handleStart} onBack={handleExit}>
        <RuleRow icon="⭐" bg={COLOR.yellow}>{toFa(STARS_ROUNDS)} مرحله داری؛ هر مرحله ستاره‌ها فقط {toFa(STARS_SHOW_MS / 1000)} ثانیه نشون داده می‌شن. سریع بشمارشون!</RuleRow>
        <RuleRow icon="🌙" bg="#A78BFA">از مرحلهٔ {toFa(11)} به بعد بین ستاره‌ها ماه هم میاد؛ ماه‌ها رو نشمار، فقط ستاره‌ها!</RuleRow>
        <RuleRow icon="🔢" bg={COLOR.pink}>بعد {toFa(4)} عدد میاد؛ تعداد درست ستاره‌ها رو انتخاب کن.</RuleRow>
        <RuleRow icon="✅" bg={COLOR.mint}>درست بزنی {toFa(STARS_BONUS_MS / 1000)} ثانیه اضافه می‌شه.</RuleRow>
        <RuleRow icon="❌" bg={COLOR.red}>اشتباه بزنی {toFa(STARS_PENALTY_MS / 1000)} ثانیه کم می‌شه و می‌ری مرحلهٔ بعد.</RuleRow>
        <RuleRow icon="⏱️" bg={COLOR.sky}>کل بازی {toFa(START_TIME_MS / 1000)} ثانیه وقت داری و امتیاز به سرعت و دقتت بستگی داره.</RuleRow>
      </Intro>
    );
  }

  const showStars = phase === "show" || phase === "feedback";
  const faceDown = phase === "show";
  const ok = chosen === round.count;
  const hasMoons = round.stars.some((s) => s.kind === "moon");

  const statusText =
    phase === "show" ? "ستاره‌ها رو بشمار! 👀"
    : phase === "answer" ? (hasMoons ? "چند تا ستاره بود؟ (ماه‌ها حساب نمی‌شن)" : "چند تا ستاره بود؟")
    : ok ? "آفرین! درست بود ✔"
    : `اشتباه شد؛ ${toFa(round.count)} تا بود`;

  const statusColor = phase === "feedback" ? (ok ? COLOR.mint : COLOR.red) : "#ffffff";
  const panelBg = phase === "feedback" ? (ok ? "#D1FAE5" : "#FFE4E6") : "#ffffff";

  return (
    <div className="flex flex-1 select-none flex-col gap-4">
      <GameHeader
        timeRef={timeRef}
        flash={flash}
        onExit={handleExit}
        stage={`مرحله ${toFa(idx + 1)} از ${toFa(STARS_ROUNDS)}`}
        tag="⭐ بازی ستاره‌ها"
      />

      <div className="flex flex-1 flex-col justify-center gap-3">
        <p className="text-center text-xl" style={{ ...DISPLAY, color: statusColor }} aria-live="polite">{statusText}</p>

        <Panel className="!p-3 transition-colors" style={{ backgroundColor: panelBg }}>
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-[#1E1B3A]"
            style={{ background: showStars ? "#ffffff" : STRIPES }}
          >
            {showStars ? (
              round.stars.map((st, i) => (
                <div
                  key={`${idx}-${i}`}
                  className="absolute"
                  style={{ left: `${st.x}%`, top: `${(st.y / 75) * 100}%`, width: `${st.s}%`, aspectRatio: "1", transform: "translate(-50%, -50%)" }}
                >
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                    initial={{ scale: 0.3, opacity: 0, rotate: st.r - 30 }}
                    animate={{ scale: 1, opacity: 1, rotate: st.r }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    aria-hidden
                  >
                    {st.kind === "star" ? (
                      <polygon points={STAR_SHAPE} fill={COLOR.yellow} stroke="#1E1B3A" strokeWidth={6} strokeLinejoin="round" />
                    ) : (
                      <path d={MOON_SHAPE} fill={COLOR.yellow} stroke="#1E1B3A" strokeWidth={6} strokeLinejoin="round" />
                    )}
                  </motion.svg>
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl" style={{ ...DISPLAY, color: INK }}>؟</div>
            )}
          </div>

          {phase === "show" ? <CountdownBar id={String(idx)} durationMs={STARS_SHOW_MS} /> : <div className="mt-3 h-3" />}
        </Panel>
      </div>

      <Panel className="mb-1 !p-3">
        <div className="grid grid-cols-4 gap-3">
          {round.options.map((n) => {
            let bg = faceDown ? COLOR.yellow : "#ffffff";
            let color = INK;
            if (phase === "feedback") {
              if (n === round.count) bg = COLOR.mint;
              else if (n === chosen) { bg = COLOR.red; color = "#ffffff"; }
            }
            const disabled = phase !== "answer";
            return (
              <motion.button
                key={n}
                type="button"
                disabled={disabled}
                {...tap(() => handlePick(n))}
                whileTap={disabled ? undefined : { scale: 0.95 }}
                aria-label={faceDown ? "گزینه" : `${toFa(n)} ستاره`}
                className={`relative touch-manipulation h-20 w-full rounded-2xl ${BORDER} text-4xl shadow-[0_4px_0_#1E1B3A] transition-colors before:absolute before:-inset-1.5 before:content-[''] ${FOCUS}`}
                style={{ ...DISPLAY, backgroundColor: bg, color, opacity: faceDown ? 0.85 : 1 }}
              >
                {faceDown ? "؟" : toFa(n)}
              </motion.button>
            );
          })}
        </div>
      </Panel>

      {timeUp && <TimeUpOverlay />}
    </div>
  );
}

/* ---------- بازی مسیر توپ ---------- */

const BALL_START_TIME_MS = 180000; // ۳ دقیقه برای ۲۰ مرحله (با +۵ ثانیه برای هر جواب درست)
const BALL_BONUS_MS = 5000;
const BALL_PENALTY_MS = 5000;
const BALL_FEEDBACK_MS = 1700;
/*
  اندازهٔ هزارتو در هر مرحله: [ستون، ردیف]
  مرحله‌های ۱ تا ۱۰ مثل قبل؛ از مرحلهٔ ۱۱ به بعد هزارتو بزرگ‌تر می‌شود
  و مسیر درست پیچ‌وخم‌دارتر و راه‌های فریبنده طولانی‌تر می‌شوند تا مرحلهٔ ۲۰ که خیلی سخت است.
*/
const BALL_SIZES: [number, number][] = [
  [4, 4], [4, 4], [5, 5], [5, 5], [5, 6], [6, 6], [6, 7], [7, 7], [7, 8], [8, 8],
  [8, 9], [8, 9], [9, 9], [9, 10], [9, 10], [9, 11], [10, 11], [10, 11], [10, 12], [10, 12],
];
const BALL_ROUNDS = BALL_SIZES.length; // ۲۰ مرحله

// ابعاد نقاشی SVG
const B_CELL = 46;
const B_PAD = 8;
const B_GOAL_H = 34;

type BallPhase = "intro" | "play" | "feedback";
type Cell = [number, number]; // [ردیف، ستون]
type BallRound = {
  cols: number;
  rows: number;
  right: boolean[][]; // راه باز بین (r,c) و (r,c+1)
  down: boolean[][]; // راه باز بین (r,c) و (r+1,c)
  ball: Cell;
  gates: number[]; // ستون سه دروازه در ردیف بالا
  target: number; // اندیس دروازهٔ درست
  path: Cell[]; // مسیر درست از توپ تا دروازه
};

/*
  امتیاز هر مرحله (حداکثر ۱۰ → مجموع ۲۰۰ که به مقیاس ۱۰۰ برگردانده می‌شود):
  - جواب درست: ۶ امتیاز دقت + تا ۴ امتیاز سرعت (≤۴ث: ۴ | ≤۷ث: ۳ | ≤۱۱ث: ۲ | ≤۱۶ث: ۱)
  - مرحله‌های بزرگ‌تر زمان بیشتری لازم دارند، پس آستانه‌های سرعت با شمارهٔ مرحله کش می‌آیند
    (مرحلهٔ ۲۰ حدود ۲٫۵ برابر مرحلهٔ ۱)
  - جواب غلط یا بی‌پاسخ: صفر
*/
function ballPoints(ok: boolean, ms: number, idx: number) {
  if (!ok) return 0;
  const t = ms / (1 + idx * 0.08);
  return 6 + (t <= 4000 ? 4 : t <= 7000 ? 3 : t <= 11000 ? 2 : t <= 16000 ? 1 : 0);
}

const emptyGrid = (cols: number, rows: number) => Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));

function carveMaze(cols: number, rows: number) {
  const right = emptyGrid(cols, rows);
  const down = emptyGrid(cols, rows);
  const seen = emptyGrid(cols, rows);

  const sr = Math.floor(Math.random() * rows);
  const sc = Math.floor(Math.random() * cols);
  seen[sr][sc] = true;
  const stack: Cell[] = [[sr, sc]];

  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = shuffle<Cell>([[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]).filter(
      ([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc]
    );
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [nr, nc] = options[0];
    if (nr === r) right[r][Math.min(c, nc)] = true;
    else down[Math.min(r, nr)][c] = true;
    seen[nr][nc] = true;
    stack.push([nr, nc]);
  }

  return { right, down };
}

function neighborsOf(r: number, c: number, cols: number, rows: number, right: boolean[][], down: boolean[][]): Cell[] {
  const out: Cell[] = [];
  if (c < cols - 1 && right[r][c]) out.push([r, c + 1]);
  if (c > 0 && right[r][c - 1]) out.push([r, c - 1]);
  if (r < rows - 1 && down[r][c]) out.push([r + 1, c]);
  if (r > 0 && down[r - 1][c]) out.push([r - 1, c]);
  return out;
}

// parent[i]: -1 = شروع، -2 = غیرقابل‌دسترس، غیر از این = خانهٔ قبلی
function bfsParents(start: Cell, cols: number, rows: number, right: boolean[][], down: boolean[][]) {
  const parent: number[] = Array(cols * rows).fill(-2);
  const s = start[0] * cols + start[1];
  parent[s] = -1;
  const queue = [s];
  for (let q = 0; q < queue.length; q++) {
    const cur = queue[q];
    const r = Math.floor(cur / cols);
    const c = cur % cols;
    for (const [nr, nc] of neighborsOf(r, c, cols, rows, right, down)) {
      const ni = nr * cols + nc;
      if (parent[ni] === -2) {
        parent[ni] = cur;
        queue.push(ni);
      }
    }
  }
  return parent;
}

function pathTo(parent: number[], target: number, cols: number): Cell[] | null {
  if (parent[target] === -2) return null;
  const out: Cell[] = [];
  for (let cur = target; cur !== -1; cur = parent[cur]) out.push([Math.floor(cur / cols), cur % cols]);
  return out.reverse();
}

function closeEdge(a: Cell, b: Cell, right: boolean[][], down: boolean[][]) {
  if (a[0] === b[0]) right[a[0]][Math.min(a[1], b[1])] = false;
  else down[Math.min(a[0], b[0])][a[1]] = false;
}

function pickGateCols(cols: number): number[] {
  for (let t = 0; t < 60; t++) {
    const pick = shuffle(Array.from({ length: cols }, (_, c) => c)).slice(0, 3).sort((a, b) => a - b);
    if (cols < 5 || (pick[1] - pick[0] >= 2 && pick[2] - pick[1] >= 2)) return pick;
  }
  return [0, Math.floor((cols - 1) / 2), cols - 1];
}

/*
  ساخت یک مرحله:
  ۱) هزارتوی کامل (درختی)؛ توپ پایین زمین و سه دروازه بالا.
  ۲) دروازهٔ درست انتخاب می‌شود و برای دو دروازهٔ دیگر روی مسیرشان دیوار می‌گذاریم.
  ۳) با جست‌وجوی دوباره مطمئن می‌شویم فقط همان یک دروازه قابل‌رسیدن است.

  سختی (d از ۰ در مرحلهٔ ۱ تا ۱ در مرحلهٔ ۲۰):
  - مسیر درست باید طولانی‌تر و پیچ‌وخم‌دارتر باشد.
  - دیوارِ مسیر فریبنده بیشتر به دروازه نزدیک گذاشته می‌شود؛ یعنی چشم مدتی
    مسیر غلط را دنبال می‌کند و در لحظهٔ آخر به بن‌بست می‌خورد.
*/
function makeBallRound(i: number): BallRound {
  const [cols, rows] = BALL_SIZES[Math.min(i, BALL_SIZES.length - 1)];
  const d = i / Math.max(1, BALL_ROUNDS - 1);
  const minLen = Math.round(rows * (1 + 0.5 * d)) + 1;

  for (let attempt = 0; attempt < 400; attempt++) {
    const { right, down } = carveMaze(cols, rows);
    const ball: Cell = [rows - 1, Math.floor(Math.random() * cols)];
    const gates = pickGateCols(cols);
    const target = Math.floor(Math.random() * 3);

    const parent = bfsParents(ball, cols, rows, right, down);
    const pathT = pathTo(parent, gates[target], cols);
    if (!pathT) continue;
    // اگر بعد از چند بار تلاش مسیر به اندازهٔ کافی طولانی پیدا نشد، شرط کم‌کم شل می‌شود
    const needLen = attempt < 250 ? minLen : attempt < 330 ? rows + 1 : 0;
    if (pathT.length < needLen) continue;

    let ok = true;
    for (let j = 0; j < 3; j++) {
      if (j === target) continue;
      const pathG = pathTo(parent, gates[j], cols);
      if (!pathG) { ok = false; break; }

      let k = 0;
      while (
        k + 1 < pathT.length && k + 1 < pathG.length &&
        pathT[k + 1][0] === pathG[k + 1][0] && pathT[k + 1][1] === pathG[k + 1][1]
      ) k++;

      // دروازه روی مسیر درست افتاده؛ این ترکیب قابل‌استفاده نیست
      if (k === pathG.length - 1) { ok = false; break; }

      // هرچه مرحله سخت‌تر، محل بستن راه به دروازه نزدیک‌تر (بن‌بست دیرتر دیده می‌شود)
      const span = pathG.length - 1 - k;
      const biased = 1 - Math.pow(Math.random(), 1 + 2 * d);
      const offset = Math.min(span - 1, Math.floor(biased * span));
      const cut = k + offset;
      closeEdge(pathG[cut], pathG[cut + 1], right, down);
    }
    if (!ok) continue;

    const check = bfsParents(ball, cols, rows, right, down);
    if (check[gates[target]] === -2) continue;
    if (gates.some((g, j) => j !== target && check[g] !== -2)) continue;

    return { cols, rows, right, down, ball, gates, target, path: pathT };
  }

  // حالت اضطراری: یک راهروی مستقیم
  const mid = Math.floor(cols / 2);
  const right = emptyGrid(cols, rows);
  const down = emptyGrid(cols, rows);
  for (let r = 0; r < rows - 1; r++) down[r][mid] = true;
  return {
    cols, rows, right, down,
    ball: [rows - 1, mid],
    gates: [0, mid, cols - 1],
    target: 1,
    path: Array.from({ length: rows }, (_, k) => [rows - 1 - k, mid] as Cell),
  };
}

/* توپ فوتبال به‌صورت SVG خالص؛ دقیقاً هم‌مرکز با (cx, cy) و بدون وابستگی به فونت اموجی */
const pentPoints = (x: number, y: number, rad: number, rotDeg: number) =>
  Array.from({ length: 5 }, (_, k) => {
    const a = ((rotDeg + 72 * k) * Math.PI) / 180;
    return `${(x + rad * Math.cos(a)).toFixed(2)},${(y + rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

function BallSprite({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const clipId = "ball-sprite-clip";
  const ink = "#1E1B3A";
  const inner = r * 0.36; // شعاع پنج‌ضلعی وسط
  const outerDist = r * 1.02; // فاصلهٔ مرکز لکه‌های لبه
  const outerSize = r * 0.4;
  const angles = [0, 1, 2, 3, 4].map((k) => -90 + 72 * k);

  return (
    <g aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill="#ffffff" />

      <g clipPath={`url(#${clipId})`}>
        {angles.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const x1 = cx + inner * Math.cos(a);
          const y1 = cy + inner * Math.sin(a);
          const x2 = cx + (outerDist - outerSize) * Math.cos(a);
          const y2 = cy + (outerDist - outerSize) * Math.sin(a);
          return <line key={`s${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={r * 0.09} strokeLinecap="round" />;
        })}

        {angles.map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <polygon
              key={`p${deg}`}
              points={pentPoints(cx + outerDist * Math.cos(a), cy + outerDist * Math.sin(a), outerSize, deg + 180)}
              fill={ink}
              stroke={ink}
              strokeWidth={r * 0.05}
              strokeLinejoin="round"
            />
          );
        })}

        <polygon points={pentPoints(cx, cy, inner, -90)} fill={ink} stroke={ink} strokeWidth={r * 0.05} strokeLinejoin="round" />
      </g>

      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={2.5} />
    </g>
  );
}

function BallMaze({ round, phase, chosen, onPick }: {
  round: BallRound; phase: BallPhase; chosen: number | null; onPick: (j: number) => void;
}) {
  const { cols, rows, right, down, ball, gates, target, path } = round;
  const top = B_PAD + B_GOAL_H;
  const W = cols * B_CELL + B_PAD * 2;
  const H = top + rows * B_CELL + B_PAD;
  const X = (c: number) => B_PAD + c * B_CELL;
  const Y = (r: number) => top + r * B_CELL;
  const feedback = phase === "feedback";

  const walls = useMemo(() => {
    const segs: string[] = [];
    for (let c = 0; c < cols; c++) {
      if (!gates.includes(c)) segs.push(`M${X(c)} ${Y(0)}L${X(c + 1)} ${Y(0)}`);
    }
    segs.push(`M${X(0)} ${Y(rows)}L${X(cols)} ${Y(rows)}`);
    segs.push(`M${X(0)} ${Y(0)}L${X(0)} ${Y(rows)}`);
    segs.push(`M${X(cols)} ${Y(0)}L${X(cols)} ${Y(rows)}`);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c < cols - 1 && !right[r][c]) segs.push(`M${X(c + 1)} ${Y(r)}L${X(c + 1)} ${Y(r + 1)}`);
        if (r < rows - 1 && !down[r][c]) segs.push(`M${X(c)} ${Y(r + 1)}L${X(c + 1)} ${Y(r + 1)}`);
      }
    }
    return segs.join("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const half = B_CELL / 2;
  const answerPath =
    "M" +
    [
      ...path.map(([r, c]) => `${X(c) + half} ${Y(r) + half}`),
      `${X(gates[target]) + half} ${B_PAD + B_GOAL_H / 2}`,
    ].join("L");

  const bx = X(ball[1]) + half;
  const by = Y(ball[0]) + half;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto block w-full select-none"
      style={{ maxWidth: `${Math.min(cols * 4.3, 36)}rem`, touchAction: "manipulation" }}
      role="group"
      aria-label="زمین بازی مسیر توپ"
    >
      {/* خطوط چمن */}
      {Array.from({ length: rows }, (_, r) => (
        <rect key={r} x={X(0)} y={Y(r)} width={cols * B_CELL} height={B_CELL} fill={r % 2 === 0 ? "#DCFCE7" : "#BBF7D0"} />
      ))}

      {/* دیوارهای هزارتو */}
      <path d={walls} fill="none" stroke="#1E1B3A" strokeWidth={3.5} strokeLinecap="round" />

      {/* دروازه‌ها */}
      {gates.map((gc, j) => {
        const x0 = X(gc);
        const isTarget = j === target;
        const wrongPick = feedback && chosen === j && !isTarget;
        const fill = feedback ? (isTarget ? COLOR.mint : wrongPick ? COLOR.red : "#ffffff") : "#ffffff";
        const netW = B_CELL - 8;
        return (
          <g
            key={gc}
            role="button"
            tabIndex={phase === "play" ? 0 : -1}
            aria-label={`دروازه ${toFa(j + 1)}`}
            style={{ cursor: phase === "play" ? "pointer" : "default", outline: "none" }}
            onPointerDown={pointerTap(() => onPick(j))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(j);
              }
            }}
          >
            <rect x={x0 + 4} y={B_PAD} width={netW} height={B_GOAL_H} rx={5} fill={fill} stroke="#1E1B3A" strokeWidth={3} />
            {[1, 2, 3, 4].map((k) => (
              <line key={k} x1={x0 + 4 + (k * netW) / 5} y1={B_PAD + 4} x2={x0 + 4 + (k * netW) / 5} y2={B_PAD + B_GOAL_H - 4} stroke="#94A3B8" strokeWidth={1} />
            ))}
            <text
              x={x0 + half}
              y={B_PAD + B_GOAL_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={17}
              style={{ ...DISPLAY, fill: wrongPick ? "#ffffff" : INK, stroke: fill, strokeWidth: 4, paintOrder: "stroke" }}
            >
              {toFa(j + 1)}
            </text>
            {/* ناحیهٔ لمس بزرگ‌تر */}
            <rect x={x0} y={0} width={B_CELL} height={top + 6} fill="transparent" />
          </g>
        );
      })}

      {/* مسیر درست بعد از جواب */}
      {feedback && (
        <motion.path
          d={answerPath}
          fill="none"
          stroke={COLOR.violet}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      )}

      {/* توپ */}
      <BallSprite cx={bx} cy={by} r={B_CELL * 0.36} />
    </svg>
  );
}

function BallGame({ onFinish, onExit }: { onFinish: (m: BallMetrics) => void; onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(() => makeBallRound(0));
  const [phase, setPhase] = useState<BallPhase>("intro");
  const [chosen, setChosen] = useState<number | null>(null);

  const { flash, show, clear } = useFlash();
  const { timeRef, pausedRef, stopRef, timeUp } = useGameClock(BALL_START_TIME_MS, true);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerStartRef = useRef(0);
  const statsRef = useRef({ correct: 0, wrong: 0, answered: 0, totalMs: 0, points: 0 });
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const finish = useCallback((timedOut: boolean) => {
    if (stopRef.current) return;
    stopRef.current = true;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    finishRef.current(buildRoundsMetrics(statsRef.current, BALL_ROUNDS, timedOut));
  }, [stopRef]);

  // پایان زمان: مکث کوتاه و رفتن به کارنامه
  useEffect(() => {
    if (!timeUp || stopRef.current) return;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    clear();
    const id = setTimeout(() => finish(true), 1600);
    return () => clearTimeout(id);
  }, [timeUp, finish, clear, stopRef]);

  useEffect(() => () => {
    if (nextTimer.current) clearTimeout(nextTimer.current);
  }, []);

  const handleStart = () => {
    pausedRef.current = false;
    answerStartRef.current = Date.now();
    setPhase("play");
  };

  const handleExit = () => {
    if (stopRef.current) return;
    stopRef.current = true;
    if (nextTimer.current) clearTimeout(nextTimer.current);
    onExit();
  };

  const handlePick = (j: number) => {
    if (phase !== "play" || timeUp || stopRef.current) return;

    const ms = Math.max(0, Math.min(60000, Date.now() - answerStartRef.current));
    const ok = j === round.target;
    const s = statsRef.current;
    s.answered += 1;
    s.totalMs += ms;
    s.points += ballPoints(ok, ms, idx);

    if (ok) {
      s.correct += 1;
      timeRef.current += BALL_BONUS_MS;
    } else {
      s.wrong += 1;
      timeRef.current = Math.max(0, timeRef.current - BALL_PENALTY_MS);
    }

    show(ok ? "good" : "bad");
    setChosen(j);
    setPhase("feedback");

    nextTimer.current = setTimeout(() => {
      if (stopRef.current) return;
      if (idx >= BALL_ROUNDS - 1) {
        finish(false);
        return;
      }
      const next = idx + 1;
      setIdx(next);
      setRound(makeBallRound(next));
      setChosen(null);
      answerStartRef.current = Date.now();
      setPhase("play");
    }, BALL_FEEDBACK_MS);
  };

  if (phase === "intro") {
    return (
      <Intro icon="⚽" title="مسیر توپ" onStart={handleStart} onBack={handleExit}>
        <RuleRow icon="⚽" bg={COLOR.yellow}>توپ پایین زمین شروع می‌کنه و باید از میان دیوارهای هزارتو بره بالا.</RuleRow>
        <RuleRow icon="🥅" bg={COLOR.pink}>بالا {toFa(3)} تا دروازه هست؛ فقط یکی‌شون راه داره و راه بقیه مسدوده.</RuleRow>
        <RuleRow icon="👆" bg="#A78BFA">مسیر توپ رو با چشمت دنبال کن و دروازه‌ای که توپ بهش می‌رسه رو بزن.</RuleRow>
        <RuleRow icon="✅" bg={COLOR.mint}>درست بزنی {toFa(BALL_BONUS_MS / 1000)} ثانیه اضافه می‌شه.</RuleRow>
        <RuleRow icon="❌" bg={COLOR.red}>اشتباه بزنی {toFa(BALL_PENALTY_MS / 1000)} ثانیه کم می‌شه و می‌ری مرحلهٔ بعد.</RuleRow>
        <RuleRow icon="🔥" bg="#FDBA74">{toFa(BALL_ROUNDS)} مرحله داری؛ هزارتو کم‌کم بزرگ‌تر و پیچیده‌تر می‌شه و مرحله‌های آخر خیلی سختن!</RuleRow>
        <RuleRow icon="⏱️" bg={COLOR.sky}>کل بازی {toFa(BALL_START_TIME_MS / 1000)} ثانیه وقت داری؛ امتیاز به سرعت و دقتت بستگی داره.</RuleRow>
      </Intro>
    );
  }

  const feedback = phase === "feedback";
  const ok = chosen === round.target;

  const statusText =
    !feedback ? "توپ به کدوم دروازه می‌رسه؟"
    : ok ? "آفرین! گل شد ⚽"
    : "اشتباه شد؛ مسیر درست رو ببین";

  const statusColor = feedback ? (ok ? COLOR.mint : COLOR.red) : "#ffffff";
  const panelBg = feedback ? (ok ? "#D1FAE5" : "#FFE4E6") : "#ffffff";

  return (
    <div className="flex flex-1 select-none flex-col gap-4">
      <GameHeader
        timeRef={timeRef}
        flash={flash}
        total={BALL_START_TIME_MS}
        onExit={handleExit}
        stage={`مرحله ${toFa(idx + 1)} از ${toFa(BALL_ROUNDS)}`}
        tag="⚽ مسیر توپ"
      />

      <div className="flex flex-1 flex-col justify-center gap-3">
        <p className="text-center text-xl" style={{ ...DISPLAY, color: statusColor }} aria-live="polite">{statusText}</p>

        <Panel className="!p-3 transition-colors" style={{ backgroundColor: panelBg }}>
          <BallMaze key={idx} round={round} phase={phase} chosen={chosen} onPick={handlePick} />
        </Panel>
      </div>

      {timeUp && <TimeUpOverlay />}
    </div>
  );
}

/* ---------- کارنامهٔ نهایی هر سه بازی ---------- */

function ResultBlock({ icon, title, score, bg, children }: {
  icon: string; title: string; score: number; bg: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl ${BORDER} p-3 text-right shadow-[3px_3px_0_#1E1B3A]`} style={{ backgroundColor: bg }} dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl" style={DISPLAY}>{icon} {title}</span>
        <span className="text-3xl leading-none" style={DISPLAY}>
          {toFa(score)}
          <span className="text-sm"> از ۱۰۰</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// چیپ‌های مشترک نتیجهٔ ستاره‌ها و مسیر توپ
function RoundsChips({ m, rounds }: { m: RoundsMetrics; rounds: number }) {
  const unanswered = rounds - m.answered;
  return (
    <>
      <Chip bg="#ffffff">✅ درست {toFa(m.correct)} از {toFa(rounds)}</Chip>
      <Chip bg="#ffffff">❌ غلط {toFa(m.wrong)}</Chip>
      <Chip bg="#ffffff">⏱️ میانگین پاسخ {formatSeconds(m.averageResponseMs)}</Chip>
      {unanswered > 0 && <Chip bg={COLOR.pink}>⏰ {toFa(unanswered)} مرحله بی‌پاسخ</Chip>}
    </>
  );
}

function FinalReport({ memory, stars, ball, onRestart, onBack }: {
  memory: MemoryMetrics | null; stars: StarsMetrics; ball: BallMetrics | null; onRestart: () => void; onBack: () => void;
}) {
  const total = (memory?.score ?? 0) + stars.score + (ball?.score ?? 0);
  const pct = total / 3;
  const grade =
    pct >= 90 ? "فوق‌العاده 🌟"
    : pct >= 75 ? "عالی 🎉"
    : pct >= 55 ? "خیلی خوب 👏"
    : pct >= 35 ? "خوب، ادامه بده 💪"
    : "شروع خوبی بود، تمرین کن 🌱";

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="w-full max-w-md">
        <Panel className="relative !p-5 sm:!p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: `6px 6px 0 ${INK}` }}>
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border-[4px] border-[#1E1B3A] bg-[#D6FFF0] shadow-[3px_3px_0_#1E1B3A]">
              <img src="/pic/drHead.png" alt="دکتر سعید" className="h-full w-full object-cover object-top" />
            </div>

            <h1 className="mt-4 text-3xl" style={DISPLAY}>کارنامهٔ نهایی 🏆</h1>

            <div className="my-3 flex items-end justify-center gap-2" dir="rtl">
              <span className="text-7xl leading-none" style={{ ...DISPLAY, color: COLOR.violet }}>{toFa(total)}</span>
              <span className="pb-1 text-xl font-black" style={DISPLAY}>از ۳۰۰</span>
            </div>

            <Chip bg={COLOR.yellow} rotate={-2}>{grade}</Chip>

            <div className="mt-5 w-full space-y-3">
              <ResultBlock icon="🧠" title="تصویرک (حافظه)" score={memory?.score ?? 0} bg="#EDE9FE">
                {memory ? (
                  <>
                    <Chip bg="#ffffff">❌ خطا {toFa(memory.errors)}</Chip>
                    <Chip bg="#ffffff">👁️ نمایش دوباره {toFa(memory.replays)}</Chip>
                    <Chip bg="#ffffff">⏱️ میانگین پاسخ {formatSeconds(memory.averageResponseMs)}</Chip>
                  </>
                ) : (
                  <Chip bg={COLOR.pink}>هنوز ۲۰ مرحلهٔ تصویرک کامل نشده</Chip>
                )}
              </ResultBlock>

              <ResultBlock icon="⭐" title="ستاره‌ها (دقت و سرعت)" score={stars.score} bg="#FEF9C3">
                <RoundsChips m={stars} rounds={STARS_ROUNDS} />
              </ResultBlock>

              <ResultBlock icon="⚽" title="مسیر توپ (دقت و سرعت)" score={ball?.score ?? 0} bg="#DCFCE7">
                {ball ? <RoundsChips m={ball} rounds={BALL_ROUNDS} /> : <Chip bg={COLOR.pink}>هنوز مسیر توپ انجام نشده</Chip>}
              </ResultBlock>
            </div>

            <p className="mt-4 text-xs font-bold leading-6 text-slate-500">
              امتیاز هر بازی از ۱۰۰ است و مجموع از ۳۰۰. امتیاز ستاره‌ها و مسیر توپ از دقت و سرعت پاسخ ساخته شده.
            </p>
          </div>
        </Panel>

        <div className="mt-7 w-full space-y-3">
          <PrimaryButton onClick={onRestart}>↺ بازی از اول</PrimaryButton>
          <SecondaryButton onClick={onBack}>← بازگشت به منوی بازی‌ها</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

/*
  پس‌زمینهٔ رترو: فقط روی منو و صفحه‌های غیربازی رندر می‌شود
  (داخل بازی اصلاً mount نمی‌شود تا perspective و mask هزینه‌ای نداشته باشند).
*/
function RetroGrid() {
  const line = (c: string, dir: string) => `linear-gradient(${dir}${c} 1.5px, transparent 1.5px)`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="tasvirak-retro-zone absolute left-1/2 top-[56%] h-[68%] w-[min(46rem,118vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(124,58,237,0.13),transparent_58%),radial-gradient(ellipse_at_50%_72%,rgba(56,189,248,0.10),transparent_68%)]" />

        <div
          className="absolute left-1/2 top-1/2 h-[145%] w-[150%] overflow-hidden opacity-[0.52]"
          style={{ transform: "translate(-50%, -50%) perspective(520px) rotateX(62deg) scale(1.12)", transformOrigin: "center center" }}
        >
          <div
            className="tasvirak-retro-grid absolute -inset-[116px]"
            style={{
              backgroundImage: `${line("rgba(125,211,252,0.30)", "")}, ${line("rgba(167,139,250,0.22)", "90deg, ")}`,
              backgroundSize: "58px 58px",
            }}
          />
        </div>

        <div className="absolute left-1/2 top-[58%] h-20 w-[62%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(103,232,249,0.16),transparent)]" />
      </div>

      <style>{`
        .tasvirak-retro-zone {
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, black 52%, rgba(0,0,0,0.75) 68%, transparent 92%);
          mask-image: radial-gradient(ellipse at center, black 0%, black 52%, rgba(0,0,0,0.75) 68%, transparent 92%);
        }
        .tasvirak-retro-grid { animation: tasvirak-grid 6s linear infinite; will-change: transform; }
        @keyframes tasvirak-grid { to { transform: translate3d(116px, 116px, 0); } }
        @media (max-width: 640px) {
          .tasvirak-retro-zone { height: 62%; width: 125vw; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tasvirak-retro-grid { animation: none; }
        }
      `}</style>
    </div>
  );
}

// دکمهٔ میان‌بر (ستاره‌ها / مسیر توپ) در بالای منو؛ تا باز نشدن قفل، پیام توضیح نشان می‌دهد
function Shortcut({ side, unlocked, icon, label, openLabel, lockedLabel, message, showMessage, onClick }: {
  side: "right" | "left"; unlocked: boolean; icon: string; label: string;
  openLabel: string; lockedLabel: string; message: string; showMessage: boolean; onClick: () => void;
}) {
  const pos = side === "right" ? "right-0" : "left-0";
  return (
    <>
      <button
        type="button"
        aria-disabled={!unlocked}
        onClick={onClick}
        aria-label={unlocked ? openLabel : lockedLabel}
        className={`touch-manipulation absolute ${pos} top-2 flex h-12 items-center gap-1.5 rounded-2xl ${BORDER} px-3 text-sm font-black text-[#111827] shadow-[3px_3px_0_#1E1B3A] transition ${
          unlocked
            ? "bg-[#FACC15] active:translate-y-1 active:shadow-[1px_1px_0_#1E1B3A]"
            : "cursor-not-allowed bg-slate-300 opacity-70 grayscale"
        } ${FOCUS}`}
      >
        <span className="text-xl leading-none" aria-hidden>{unlocked ? icon : "🔒"}</span>
        {label}
      </button>

      {showMessage && !unlocked && (
        <div
          role="alert"
          className={`absolute ${pos} top-16 z-20 w-60 rounded-2xl ${BORDER} bg-white px-3 py-2 text-right text-xs font-black leading-6 shadow-[3px_3px_0_#1E1B3A]`}
        >
          🔒 {message}
        </div>
      )}
    </>
  );
}

/* ---------- صفحهٔ اصلی ---------- */

export default function VisualPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("menu");
  const [gameKey, setGameKey] = useState(0);
  const [best, setBest] = useState(0);
  const [gameStartLevel, setGameStartLevel] = useState(1);
  const [gameStartMs, setGameStartMs] = useState(FIRST_TIME_MS);
  const [played, setPlayed] = useState(false); // آیا قبلاً بازی را شروع کرده؟
  const [score, setScore] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [starsKey, setStarsKey] = useState(0);
  const [ballKey, setBallKey] = useState(0);
  const [starsOrigin, setStarsOrigin] = useState<"menu" | "nextTest">("nextTest");
  const [hasMemoryResult, setHasMemoryResult] = useState(false);
  const [hasStarsResult, setHasStarsResult] = useState(false);
  const [lockMsg, setLockMsg] = useState<"stars" | "ball" | null>(null);
  const [starsMetrics, setStarsMetrics] = useState<StarsMetrics>({
    correct: 0, wrong: 0, answered: 0, averageResponseMs: 0, score: 0, timedOut: false,
  });
  const [ballMetrics, setBallMetrics] = useState<BallMetrics | null>(null);
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics>({
    errors: 0, replays: 0, attempts: 0, averageResponseMs: 0, score: 0,
  });

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(BEST_KEY));
      if (saved > 0) setBest(saved);
      // کاربرانی که قبلاً رکورد دارند هم «بار اول» حساب نمی‌شوند
      if (saved > 0 || localStorage.getItem(PLAYED_KEY)) setPlayed(true);
    } catch {}
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      const m = raw ? (JSON.parse(raw) as MemoryMetrics) : null;
      if (m && typeof m.score === "number") {
        setMemoryMetrics(m);
        setHasMemoryResult(true);
      }
    } catch {}
    try {
      const raw = localStorage.getItem(STARS_KEY);
      const sm = raw ? (JSON.parse(raw) as StarsMetrics) : null;
      if (sm && typeof sm.score === "number") {
        setStarsMetrics(sm);
        setHasStarsResult(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!lockMsg) return;
    const id = setTimeout(() => setLockMsg(null), 3500);
    return () => clearTimeout(id);
  }, [lockMsg]);

  const checkpointLevel = getStageStartLevel(best);

  // ستاره‌ها فقط بعد از پایان مرحلهٔ ۲۰ تصویرک؛ مسیر توپ فقط بعد از پایان تصویرک و ستاره‌ها
  const starsUnlocked = best >= LEVELS.length || hasMemoryResult;
  const ballUnlocked = starsUnlocked && hasStarsResult;

  const launch = (from: number) => {
    // بار اول ۱۲۰ ثانیه، از بار دوم به بعد (از هر چک‌پوینت) ۶۰ ثانیه
    setGameStartMs(played ? START_TIME_MS : FIRST_TIME_MS);
    if (!played) {
      setPlayed(true);
      try { localStorage.setItem(PLAYED_KEY, "1"); } catch {}
    }
    setGameStartLevel(from);
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  const startGame = () => launch(checkpointLevel); // از آخرین چک‌پوینت
  const startGameFromBeginning = () => launch(1); // همیشه مرحله ۱
  const exitGame = () => setScreen("menu");
  const goGames = () => router.push("/games");
  const goTutorial = () => setScreen("tutorial");

  const openStars = (origin: "menu" | "nextTest") => {
    setStarsOrigin(origin);
    setStarsKey((k) => k + 1);
    setScreen("stars");
  };

  const handleStarsFinish = useCallback((m: StarsMetrics) => {
    setStarsMetrics(m);
    // اگر هر ۲۰ مرحلهٔ ستاره‌ها تمام شده باشد، مستقیم وارد مسیر توپ می‌شویم
    if (!m.timedOut && m.answered >= STARS_ROUNDS) {
      setHasStarsResult(true);
      try { localStorage.setItem(STARS_KEY, JSON.stringify(m)); } catch {}
      setBallKey((k) => k + 1);
      setScreen("ball");
    } else {
      setScreen("final");
    }
  }, []);

  const handleBallFinish = useCallback((m: BallMetrics) => {
    setBallMetrics(m);
    setScreen("final");
  }, []);

  const handleOver = useCallback(
    (completed: number, didWin = false, metrics?: MemoryMetrics) => {
      const record = completed > best;
      if (record) {
        setBest(completed);
        try { localStorage.setItem(BEST_KEY, String(completed)); } catch {}
      }
      setScore(completed);
      setNewRecord(record);
      if (metrics) {
        setMemoryMetrics(metrics);
        setHasMemoryResult(true);
        try { localStorage.setItem(MEMORY_KEY, JSON.stringify(metrics)); } catch {}
      }
      setScreen(didWin && completed >= LEVELS.length ? "nextTest" : "over");
    },
    [best]
  );

  const inGame = screen === "game" || screen === "stars" || screen === "ball";

  return (
    <main
      dir="rtl"
      className={`${displayFont.variable} ${bodyFont.variable} relative flex min-h-[100dvh] justify-center overflow-x-hidden px-4`}
      style={{
        fontFamily: "var(--font-body), Tahoma, sans-serif",
        touchAction: "manipulation", // جلوگیری از تأخیر/زوم دابل‌تپ هنگام ضربهٔ سریع
        WebkitTapHighlightColor: "transparent",
        color: INK,
        background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,.18), transparent 42%), linear-gradient(180deg, #0B1020 0%, #111827 100%)",
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      {!inGame && <RetroGrid />}

      <div className="relative z-10 flex w-full max-w-md flex-col">
        {screen === "menu" && (
          <div className="relative flex flex-1 flex-col items-center justify-center py-6 text-center">
            <Shortcut
              side="right"
              unlocked={starsUnlocked}
              icon="⭐"
              label="ستاره‌ها"
              openLabel="ورود به بازی ستاره‌ها"
              lockedLabel="بازی ستاره‌ها قفل است"
              message="اول باید بازی تصویرک را تا مرحله ۲۰ به پایان برسانی، بعد بازی ستاره‌ها را شروع کنی."
              showMessage={lockMsg === "stars"}
              onClick={() => (starsUnlocked ? openStars("menu") : setLockMsg("stars"))}
            />

            <Shortcut
              side="left"
              unlocked={ballUnlocked}
              icon="⚽"
              label="مسیر توپ"
              openLabel="ورود به بازی مسیر توپ"
              lockedLabel="بازی مسیر توپ قفل است"
              message="اول باید بازی تصویرک و بازی ستاره‌ها را تا مرحلهٔ آخر به پایان برسانی، بعد مسیر توپ باز می‌شود."
              showMessage={lockMsg === "ball"}
              onClick={() => {
                if (!ballUnlocked) return setLockMsg("ball");
                setBallKey((k) => k + 1);
                setScreen("ball");
              }}
            />

            <HeroFan />

            <h1 className="mt-8 text-7xl leading-none text-white" style={TITLE_SHADOW(4)}>تصویرک</h1>

            <p className="mt-4 max-w-[16rem] text-base font-bold leading-7 text-white">ترتیب کارت‌ها رو حفظ کن و به همون ترتیب بزن.</p>

            {best > 0 && (
              <div className="mt-4"><Chip bg={COLOR.yellow} rotate={-2}>بهترین رکورد: مرحله {toFa(best)}</Chip></div>
            )}

            <div className="mt-8 w-full max-w-xs space-y-3">
              <PrimaryButton onClick={startGame}>شروع بازی</PrimaryButton>
              {best > 0 && <SecondaryButton onClick={startGameFromBeginning}>↺ شروع از اول</SecondaryButton>}
              <SecondaryButton onClick={goTutorial}>آموزش بازی</SecondaryButton>
            </div>

            <div className="mt-5"><TextLink onClick={goGames}>← بازگشت به منوی بازی‌ها</TextLink></div>
          </div>
        )}

        {screen === "tutorial" && <Tutorial onStart={startGame} onBack={() => setScreen("menu")} />}

        {screen === "game" && (
          <Game key={gameKey} initialLevel={gameStartLevel} startMs={gameStartMs} onOver={handleOver} onExit={exitGame} />
        )}

        {screen === "nextTest" && (
          <DoctorNextTest metrics={memoryMetrics} onStartStars={() => openStars("nextTest")} onBack={goGames} />
        )}

        {screen === "stars" && (
          <StarsGame key={starsKey} onFinish={handleStarsFinish} onExit={() => setScreen(starsOrigin)} />
        )}

        {screen === "ball" && (
          <BallGame key={ballKey} onFinish={handleBallFinish} onExit={() => setScreen("menu")} />
        )}

        {screen === "final" && (
          <FinalReport memory={hasMemoryResult ? memoryMetrics : null} stars={starsMetrics} ball={ballMetrics} onRestart={startGameFromBeginning} onBack={goGames} />
        )}

        {screen === "over" && (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${BORDER} bg-[#FFD43B] text-5xl shadow-[4px_4px_0_#1E1B3A]`}>⏰</div>

            <h1 className="mt-6 text-5xl text-white" style={TITLE_SHADOW(3)}>وقت تموم شد!</h1>

            <Panel className="mt-6 w-full max-w-xs">
              <p className="text-sm font-black text-slate-500">مرحله‌های کامل‌شده</p>
              <p className="mt-1 text-7xl leading-none" style={{ ...DISPLAY, color: COLOR.violet }}>{toFa(score)}</p>

              <div className="mt-4">
                {newRecord && score > 0 ? (
                  <Chip bg={COLOR.mint} rotate={-2}>🎉 رکورد جدید!</Chip>
                ) : (
                  <Chip bg={COLOR.yellow} rotate={-2}>بهترین رکورد: مرحله {toFa(best)}</Chip>
                )}
              </div>
            </Panel>

            {best >= STAGE_STARTS[1] && (
              <p className="mt-4 text-sm font-bold text-white">بازی دوباره از مرحله {toFa(checkpointLevel)} شروع می‌شود.</p>
            )}

            <div className="mt-8 w-full max-w-xs space-y-3">
              <PrimaryButton onClick={startGame}>بازی دوباره</PrimaryButton>
              <SecondaryButton onClick={startGameFromBeginning}>↺ شروع از اول</SecondaryButton>
              <SecondaryButton onClick={goTutorial}>آموزش بازی</SecondaryButton>
            </div>

            <div className="mt-5"><TextLink onClick={goGames}>← بازگشت به منوی بازی‌ها</TextLink></div>
          </div>
        )}
      </div>
    </main>
  );
}