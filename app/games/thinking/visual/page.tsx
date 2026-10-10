"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lalezar, Vazirmatn } from "next/font/google";

const displayFont = Lalezar({ subsets: ["arabic", "latin"], weight: "400", variable: "--font-display", display: "swap" });
const bodyFont = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-body", display: "swap" });

const START_TIME_MS = 60000;
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

const ALLOW_CONSECUTIVE_REPEAT = false;
const BEST_KEY = "tasvirak-best-level";

const ANIMAL_SYMBOLS = ["🐮", "🐑", "🐰", "🐔", "🐴", "🐷", "🦊", "🐸", "🐵", "🐼"];
const VEHICLE_SYMBOLS = ["🚗", "🚕", "🚌", "🏎️", "🚲", "🚁", "✈️", "🚀"];
const SYMBOLS = [...ANIMAL_SYMBOLS, ...VEHICLE_SYMBOLS];

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

type Screen = "menu" | "tutorial" | "game" | "over" | "nextTest" | "comingSoon";
type Phase = "memorize" | "input" | "levelup";
type Flash = { id: number; kind: "good" | "bad"; amount: number };
type MemoryMetrics = {
  errors: number; replays: number; attempts: number;
  averageResponseMs: number; totalInputMs: number; score: number;
};

function calculateMemoryScore({ errors, replays, averageResponseMs }: Pick<MemoryMetrics, "errors" | "replays" | "averageResponseMs">) {
  const base = averageResponseMs <= 1800 ? 100 : 98;
  const penalty = errors > 0 ? errors * (replays > 0 ? 6 : 4) : replays * 2;
  return Math.max(0, Math.min(100, Math.round(base - penalty)));
}

const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(1).replace(".0", "")} ثانیه`;
const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

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

const getRoundSymbols = (level: number) =>
  level < 15
    ? ANIMAL_SYMBOLS
    : [...shuffle(ANIMAL_SYMBOLS).slice(0, 6), ...shuffle(VEHICLE_SYMBOLS).slice(0, 2)];

function makeRound(level: number) {
  const safeLevel = Math.max(1, Math.min(level, LEVELS.length));
  const cfg = LEVELS[safeLevel - 1];
  const length = cfg.cards;
  const uniqueCount = Math.min(cfg.unique, length, SYMBOLS.length);
  const pool = getRoundSymbols(safeLevel);

  let chosen: string[];
  if (safeLevel >= 15) {
    const vehicle = shuffle(VEHICLE_SYMBOLS)[0];
    const rest = shuffle(pool.filter((s) => s !== vehicle));
    chosen = [vehicle, ...rest].slice(0, uniqueCount);
  } else {
    chosen = shuffle(pool).slice(0, uniqueCount);
  }

  let sequence: string[] = [];
  for (let attempt = 0; attempt < 300; attempt++) {
    const extra = Array.from({ length: length - uniqueCount }, () => chosen[Math.floor(Math.random() * chosen.length)]);
    sequence = shuffle([...chosen, ...extra]);
    if (ALLOW_CONSECUTIVE_REPEAT || !hasConsecutive(sequence)) break;
  }

  return { sequence, options: shuffle(chosen), memorizeMs: cfg.memorize * 1000 };
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

function TimerBar({ ms, flash }: { ms: number; flash: Flash | null }) {
  const sec = Math.ceil(ms / 1000);
  const pct = Math.max(0, Math.min(100, (ms / START_TIME_MS) * 100));
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

/*
  تایمر زنده: فقط همین کامپوننت هر ۲۰۰ میلی‌ثانیه رندر می‌شود.
  قبلاً کل بازی (کارت‌ها، دکمه‌ها، …) هر ۱۰۰ms دوباره رندر می‌شد.
*/
function LiveTimer({ timeRef, flash }: { timeRef: React.MutableRefObject<number>; flash: Flash | null }) {
  const [ms, setMs] = useState(timeRef.current);

  useEffect(() => {
    const id = setInterval(() => setMs(timeRef.current), 200);
    return () => clearInterval(id);
  }, [timeRef]);

  useEffect(() => setMs(timeRef.current), [flash, timeRef]);

  return <TimerBar ms={ms} flash={flash} />;
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
            // لمس با pointerdown ثبت می‌شود (نه click): با ضربهٔ سریع، لرزش انگشت یا لغزش کم، ضربه از دست نمی‌رود
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              onPick(sym);
            }}
            // کیبورد (Enter/Space) با detail === 0
            onClick={(e) => {
              if (e.detail === 0) onPick(sym);
            }}
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

/* ---------- بازی ---------- */

function Game({ onOver, onExit, initialLevel }: {
  onOver: (completedLevels: number, won?: boolean, metrics?: MemoryMetrics) => void;
  onExit: () => void;
  initialLevel: number;
}) {
  const [level, setLevel] = useState(initialLevel);
  const [round, setRound] = useState(() => makeRound(initialLevel));
  const [phase, setPhase] = useState<Phase>("memorize");
  const [replays, setReplays] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [restartLevel, setRestartLevel] = useState<number | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);

  const timeoutModal = restartLevel !== null;

  // زمان باقی‌مانده در ref است تا هر ۱۰۰ms کل بازی رندر نشود
  const timeRef = useRef(START_TIME_MS);
  const pausedRef = useRef(false);
  const flashId = useRef(0);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitingRef = useRef(false);
  const statsRef = useRef({ errors: 0, replays: 0, attempts: 0, totalResponseMs: 0, totalInputMs: 0 });
  const inputStartedAtRef = useRef<number | null>(null);
  const lastPickAtRef = useRef<number | null>(null);

  const resetInputClock = useCallback(() => {
    const now = Date.now();
    inputStartedAtRef.current = now;
    lastPickAtRef.current = now;
  }, []);

  const commitInputSegment = useCallback(() => {
    if (inputStartedAtRef.current === null) return;
    const elapsed = Math.max(0, Date.now() - inputStartedAtRef.current);
    statsRef.current.totalInputMs += Math.min(elapsed, START_TIME_MS);
    inputStartedAtRef.current = null;
    lastPickAtRef.current = null;
  }, []);

  const buildMetrics = useCallback((): MemoryMetrics => {
    const { errors, replays, attempts, totalResponseMs, totalInputMs } = statsRef.current;
    const averageResponseMs = attempts > 0 ? totalResponseMs / attempts : 0;
    return {
      errors, replays, attempts, averageResponseMs, totalInputMs,
      score: calculateMemoryScore({ errors, replays, averageResponseMs }),
    };
  }, []);

  const showFlash = (kind: Flash["kind"], amount = 5) => {
    flashId.current += 1;
    setFlash({ id: flashId.current, kind, amount });
  };

  // تایمر اصلی: بدون setState، فقط ref را کم می‌کند و در لحظهٔ صفر شدن یک بار state می‌گذارد
  useEffect(() => {
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      if (pausedRef.current || exitingRef.current) return;
      timeRef.current = Math.max(0, timeRef.current - dt);
      if (timeRef.current <= 0) {
        pausedRef.current = true;
        setTimeUp(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // پایان زمان: محاسبهٔ چک‌پوینت و نمایش پیام
  useEffect(() => {
    if (!timeUp || timeoutModal || exitingRef.current) return;
    commitInputSegment();
    setModal(false);
    setFlash(null);
    setRestartLevel(getStageStartLevel(level));
  }, [timeUp, timeoutModal, level, commitInputSegment]);

  // ورود به مرحلهٔ حفظ کردن
  useEffect(() => {
    if (phase !== "memorize" || timeoutModal) return;
    const id = setTimeout(() => {
      if (exitingRef.current) return;
      if (inputStartedAtRef.current === null) resetInputClock();
      setPhase("input");
    }, round.memorizeMs);
    return () => clearTimeout(id);
  }, [phase, round.memorizeMs, resetInputClock, timeoutModal]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 1200);
    return () => clearTimeout(id);
  }, [flash]);

  const closeModal = useCallback(() => {
    setModal(false);
    setPicked([]);
    resetInputClock();
  }, [resetInputClock]);

  useEffect(() => {
    if (!modal) return;
    const id = setTimeout(closeModal, 1400);
    return () => clearTimeout(id);
  }, [modal, closeModal]);

  useEffect(() => () => {
    if (nextTimer.current) clearTimeout(nextTimer.current);
    commitInputSegment();
  }, [commitInputSegment]);

  const handleExit = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
      nextTimer.current = null;
    }
    commitInputSegment();
    onExit();
  };

  // ادامه بعد از پایان تایمر: از چک‌پوینت همان استیج با ۶۰ ثانیه تازه
  const handleTimeoutContinue = () => {
    if (restartLevel === null || exitingRef.current) return;
    const lv = restartLevel;
    timeRef.current = START_TIME_MS;
    pausedRef.current = false;
    setTimeUp(false);
    setRestartLevel(null);
    setModal(false);
    setFlash(null);
    setLevel(lv);
    setRound(makeRound(lv));
    setPicked([]);
    setReplays(0);
    setPhase("memorize");
  };

  const handlePick = (sym: string) => {
    if (phase !== "input" || modal || timeoutModal || exitingRef.current) return;

    const now = Date.now();
    const reactionMs = Math.max(0, Math.min(10000, now - (lastPickAtRef.current ?? now)));
    statsRef.current.attempts += 1;
    statsRef.current.totalResponseMs += reactionMs;
    lastPickAtRef.current = now;

    if (sym === round.sequence[picked.length]) {
      const next = [...picked, sym];
      setPicked(next);
      if (next.length !== round.sequence.length) return;

      setPhase("levelup");
      timeRef.current += BONUS_MS;
      showFlash("good");

      if (level >= LEVELS.length) {
        commitInputSegment();
        nextTimer.current = setTimeout(() => {
          if (!exitingRef.current) onOver(level, true, buildMetrics());
        }, 1100);
      } else {
        nextTimer.current = setTimeout(() => {
          if (exitingRef.current) return;
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setRound(makeRound(nextLevel));
          setPicked([]);
          setReplays(0);
          setPhase("memorize");
        }, 1100);
      }
    } else {
      statsRef.current.errors += 1;
      timeRef.current = Math.max(0, timeRef.current - PENALTY_MS);
      showFlash("bad");
      setModal(true);
    }
  };

  const canReplay = phase === "input" && !modal && !timeoutModal && !exitingRef.current && timeRef.current > REPLAY_COST_MS;

  const handleReplay = () => {
    if (!canReplay) return;
    statsRef.current.replays += 1;
    timeRef.current = Math.max(0, timeRef.current - REPLAY_COST_MS);
    showFlash("bad", REPLAY_COST_MS / 1000);
    setReplays((r) => r + 1);
    setPhase("memorize");
  };

  const handleKnowIt = () => {
    if (phase !== "memorize" || timeoutModal || exitingRef.current) return;
    resetInputClock();
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
      <div>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <LiveTimer timeRef={timeRef} flash={flash} />
          </div>
          <button
            type="button"
            onClick={handleExit}
            className={`flex h-14 shrink-0 items-center justify-center rounded-2xl ${BORDER} bg-[#FACC15] px-3 text-sm font-black text-[#111827] shadow-[3px_3px_0_#1E1B3A] transition active:translate-y-1 active:shadow-[1px_1px_0_#1E1B3A] ${FOCUS}`}
            aria-label="خروج از بازی"
          >
            خروج
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Chip bg={COLOR.yellow} rotate={-2}>مرحله {toFa(level)} از {toFa(LEVELS.length)}</Chip>
          <Chip bg="#ffffff" rotate={2}>{toFa(total)} کارت</Chip>
        </div>
      </div>

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

          <div className="mt-3 h-3">
            {phase === "memorize" && (
              <div className="h-3 overflow-hidden rounded-full border-2 border-[#1E1B3A] bg-white">
                {/* با scaleX (فقط GPU) به‌جای width که هر فریم layout می‌سازد */}
                <motion.div
                  key={`${level}-${replays}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: round.memorizeMs / 1000, ease: "linear" }}
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: COLOR.violet, transformOrigin: "right" }}
                />
              </div>
            )}
          </div>
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
              <h2 className="mt-5 text-5xl text-white" style={{ ...DISPLAY, textShadow: `3px 3px 0 ${INK}` }}>اشتباه بود!</h2>
              <div className={`mt-5 inline-block rounded-2xl ${BORDER} bg-white px-5 py-2 text-2xl shadow-[3px_3px_0_#1E1B3A]`} style={{ ...DISPLAY, color: INK }}>
                −{toFa(PENALTY_MS / 1000)} ثانیه
              </div>
              <p className="mt-4 text-sm font-bold text-white">دوباره از اول همین مرحله بچین</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* پایان زمان و بازگشت به چک‌پوینت (بدون backdrop-filter که روی گوشی سنگین است) */}
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
                <RuleRow icon="⏱️" bg={COLOR.sky}>{toFa(60)} ثانیه از شروع هر مرحله وقت داری؛ حتی زمان دیدن و حفظ کردن کارت‌ها هم از تایمر کم می‌شود.</RuleRow>
                <RuleRow icon="👀" bg={COLOR.yellow}>چند کارت نشونت می‌دیم؛ ترتیبشون رو حفظ کن.</RuleRow>
                <RuleRow icon="👆" bg={COLOR.pink}>بعد نمادها رو به همون ترتیب از پایین انتخاب کن.</RuleRow>
                <RuleRow icon="✅" bg={COLOR.mint}>درست بزنی {toFa(5)} ثانیه اضافه می‌شه.</RuleRow>
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
        <div className="relative overflow-visible">
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

          <div className="pointer-events-none absolute -left-3 top-6 text-3xl" aria-hidden>✨</div>
          <div className="pointer-events-none absolute -right-3 top-20 text-3xl" aria-hidden>⭐</div>
        </div>

        <div className="mt-7 w-full space-y-3">
          <PrimaryButton onClick={onStartStars}>⭐ شروع بازی ستاره‌ها</PrimaryButton>
          <SecondaryButton onClick={onBack}>← بازگشت به منوی بازی‌ها</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function StarsComingSoon({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-4xl" aria-hidden>
          <span>⭐</span><span>✨</span><span>⭐</span>
        </div>

        <Panel className="!p-7 sm:!p-8" style={{ backgroundColor: "#FFFFFF", boxShadow: `6px 6px 0 ${INK}` }}>
          <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${BORDER} bg-[#FFD43B] text-5xl shadow-[4px_4px_0_#1E1B3A]`} aria-hidden>⭐</div>

          <h1 className="mt-6 text-5xl leading-none" style={{ ...DISPLAY, color: COLOR.violet }}>بازی ستاره‌ها</h1>

          <div className={`mx-auto mt-5 inline-flex rounded-full ${BORDER} bg-[#FF5C8A] px-5 py-2 text-2xl text-white shadow-[3px_3px_0_#1E1B3A]`} style={DISPLAY}>
            به‌زودی
          </div>

          <p className="mt-3 text-xl" style={{ ...DISPLAY, color: INK }}>Coming Soon</p>

          <p className="mt-4 text-sm font-bold leading-7 text-slate-600">
            این بازی در حال آماده‌سازی است.
            <br />
            به‌زودی یک چالش تازه برای سرعت محاسبات و هوش ریاضی در دسترس قرار می‌گیرد. 🚀
          </p>
        </Panel>

        <div className="mt-7 w-full">
          <SecondaryButton onClick={onBack}>← بازگشت به منوی بازی‌ها</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

/*
  پس‌زمینهٔ رترو:
  - قبلاً background-position انیمیت می‌شد (هر فریم repaint روی یک المان بزرگ با perspective)؛
    حالا فقط transform انیمیت می‌شود که روی GPU اجرا می‌شود.
  - blur-3xl و انیمیشن glow حذف شد.
  - داخل خود بازی (animate=false) انیمیشن متوقف است.
*/
function RetroGrid({ animate }: { animate: boolean }) {
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
            className={`tasvirak-retro-grid absolute -inset-[116px] ${animate ? "" : "tasvirak-paused"}`}
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
        .tasvirak-paused { animation-play-state: paused; }
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

/* ---------- صفحهٔ اصلی ---------- */

export default function VisualPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("menu");
  const [gameKey, setGameKey] = useState(0);
  const [best, setBest] = useState(0);
  const [gameStartLevel, setGameStartLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics>({
    errors: 0, replays: 0, attempts: 0, averageResponseMs: 0, totalInputMs: 0, score: 0,
  });

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(BEST_KEY));
      if (saved > 0) setBest(saved);
    } catch {}
  }, []);

  const checkpointLevel = getStageStartLevel(best);

  const launch = (from: number) => {
    setGameStartLevel(from);
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  const startGame = () => launch(checkpointLevel); // از آخرین چک‌پوینت
  const startGameFromBeginning = () => launch(1); // همیشه مرحله ۱
  const exitGame = () => setScreen("menu");
  const goGames = () => router.push("/games");
  const goTutorial = () => setScreen("tutorial");

  const handleOver = useCallback(
    (completed: number, didWin = false, metrics?: MemoryMetrics) => {
      const record = completed > best;
      if (record) {
        setBest(completed);
        try { localStorage.setItem(BEST_KEY, String(completed)); } catch {}
      }
      setScore(completed);
      setNewRecord(record);
      if (metrics) setMemoryMetrics(metrics);
      setScreen(didWin && completed >= LEVELS.length ? "nextTest" : "over");
    },
    [best]
  );

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
      <RetroGrid animate={screen !== "game"} />

      <div className="relative z-10 flex w-full max-w-md flex-col">
        {screen === "menu" && (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <HeroFan />

            <h1 className="mt-8 text-7xl leading-none text-white" style={{ ...DISPLAY, textShadow: `4px 4px 0 ${INK}` }}>تصویرک</h1>

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

        {screen === "game" && <Game key={gameKey} initialLevel={gameStartLevel} onOver={handleOver} onExit={exitGame} />}

        {screen === "nextTest" && (
          <DoctorNextTest metrics={memoryMetrics} onStartStars={() => setScreen("comingSoon")} onBack={goGames} />
        )}

        {screen === "comingSoon" && <StarsComingSoon onBack={goGames} />}

        {screen === "over" && (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${BORDER} bg-[#FFD43B] text-5xl shadow-[4px_4px_0_#1E1B3A]`}>⏰</div>

            <h1 className="mt-6 text-5xl text-white" style={{ ...DISPLAY, textShadow: `3px 3px 0 ${INK}` }}>وقت تموم شد!</h1>

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