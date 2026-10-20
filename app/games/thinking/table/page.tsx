"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  getTableLevel,
  isBonusWord,
  normalizeWord,
  tableLevels,
} from "../../data/wordGames";

const TOTAL_LEVELS = tableLevels.length;

const COINS_KEY = "word-game-coins";
const LEVEL_KEY = "word-game-level";
const MAX_LEVEL_KEY = "word-game-max-level";
const STARS_KEY = "word-game-level-stars";
const BONUS_WORDS_KEY = "word-game-bonus-words";
const TUTORIAL_KEY = "word-game-tutorial-seen";
const GAME_MIGRATION_KEY = "word-game-map-migration-v1";
const LEVEL_REWARDS_KEY = "word-game-level-rewards-v1";
const THEME_KEY = "word-game-theme";

// جایزه سکه هر مرحله بر اساس بازه‌ی مراحل (به‌جای زنجیره if تکراری)
const LEVEL_REWARD_TIERS: { max: number; reward: number }[] = [
  { max: 10, reward: 3 },
  { max: 20, reward: 5 },
  { max: 30, reward: 6 },
  { max: 40, reward: 8 },
  { max: 50, reward: 10 },
];

function getLevelReward(levelNumber: number): number {
  const tier = LEVEL_REWARD_TIERS.find((t) => levelNumber <= t.max);
  return tier ? tier.reward : 0;
}

/* =============================================================
   تم بازی — فقط ظاهر عوض می‌شود، منطق بازی دست‌نخورده است
   classic: حالت قبلی (کلیک روی حروف + دکمه پیدا کن)
   persian: حالت سنتی ایرانی (حروف روی سینی، کشیدن انگشت)
============================================================= */

type Theme = "classic" | "persian";

type WordStatus = "main" | "bonus" | "duplicate" | "none";
type SubmitResult = "main" | "bonus" | "duplicate" | "wrong";

// هندسه‌ی چرخ حروف (واحدها در یک بوم ۳۰۰×۳۰۰ هستند و با CSS مقیاس می‌شوند)
const WHEEL_SIZE = 300;
const WHEEL_RADIUS = 94;
const WHEEL_MAX_NODE_R = 27;

// رنگ خط بین حروف
const LINE_COLORS: Record<string, string> = {
  none: "#f97316", // نارنجی: هنوز درست نشده
  main: "#22c55e", // سبز: کلمه اصلی درست
  bonus: "#10b981", // سبز: کلمه جایزه
  duplicate: "#eab308", // زرد: قبلاً پیدا شده
  wrong: "#ef4444", // قرمز: غلط (بعد از رها کردن انگشت)
};

type WheelNode = {
  letter: string;
  originalIndex: number;
  x: number;
  y: number;
  r: number;
  hitR: number;
};

type Flash = {
  path: number[];
  status: SubmitResult;
  word: string;
};

/* =============================================================
   localStorage helpers — یک‌جا و ایمن، به‌جای try/catch پراکنده
============================================================= */

function readNumber(key: string, fallback: number | null = null) {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value)
  );
}

/* =============================================================
   پس‌زمینه‌ی حروف — خیلی کم‌رنگ، هماهنگ با موضوع بازی کلمات
   (تصادفی اما با seed ثابت تا بین سرور و کلاینت یکسان بماند)
============================================================= */

const PERSIAN_LETTERS = [
  "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د",
  "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ",
  "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی",
];

function createSeededRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type BackgroundLetter = {
  char: string;
  top: number;
  left: number;
  size: number;
  rotate: number;
  opacity: number;
};

const BACKGROUND_LETTERS: BackgroundLetter[] = (() => {
  const rand = createSeededRandom(1404);
  const count = 46;

  return Array.from({ length: count }, () => ({
    char: PERSIAN_LETTERS[Math.floor(rand() * PERSIAN_LETTERS.length)],
    top: rand() * 100,
    left: rand() * 100,
    size: 34 + rand() * 74,
    rotate: rand() * 56 - 28,
    opacity: 0.025 + rand() * 0.035,
  }));
})();

function LetterBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      {BACKGROUND_LETTERS.map((item, index) => (
        <span
          key={index}
          className="absolute font-black text-indigo-950"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            transform: `rotate(${item.rotate}deg)`,
            opacity: item.opacity,
            lineHeight: 1,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}

/* =============================================================
   پس‌زمینه‌ی سنتی ایرانی — کاغذ کرم، نقش ختایی/خاتم خیلی محو،
   قاب طلایی و یک طاق (محراب) ظریف بالای صفحه
============================================================= */

function PersianBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden bg-[#f3e9d2]"
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* نقش خاتم: دو مربع چرخیده (ستاره هشت‌پر) + دایره */}
          <pattern id="khatamPattern" width="72" height="72" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#1f6f78" strokeWidth="1" opacity="0.13">
              <rect x="16" y="16" width="40" height="40" />
              <rect x="16" y="16" width="40" height="40" transform="rotate(45 36 36)" />
              <circle cx="36" cy="36" r="9" />
            </g>
            <g fill="#b8892f" opacity="0.16">
              <circle cx="0" cy="0" r="2.4" />
              <circle cx="72" cy="0" r="2.4" />
              <circle cx="0" cy="72" r="2.4" />
              <circle cx="72" cy="72" r="2.4" />
            </g>
          </pattern>
          {/* وسط صفحه را روشن‌تر می‌کند تا نقش فقط کنارها دیده شود */}
          <radialGradient id="persianCalm" cx="50%" cy="48%" r="65%">
            <stop offset="0%" stopColor="#f8f0dc" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f5ebd4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#f3e9d2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#khatamPattern)" />
        <rect width="100%" height="100%" fill="url(#persianCalm)" />
      </svg>

      {/* هاله‌های فیروزه‌ای و لاجوردی */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sky-900/10 blur-3xl" />

      {/* طاق ظریف بالای صفحه */}
      <svg
        viewBox="0 0 200 120"
        className="absolute left-1/2 top-1 w-[250px] -translate-x-1/2 sm:w-[300px]"
        fill="none"
      >
        <path
          d="M14 120 V72 C14 42 80 38 100 4 C120 38 186 42 186 72 V120"
          stroke="#b8892f"
          strokeWidth="1.4"
          opacity="0.4"
        />
        <path
          d="M26 120 V74 C26 50 84 46 100 18 C116 46 174 50 174 74 V120"
          stroke="#1f6f78"
          strokeWidth="1"
          opacity="0.28"
        />
      </svg>

      {/* قاب دوخطی */}
      <div className="absolute inset-2 rounded-[26px] border border-[#b8892f]/35" />
      <div className="absolute inset-3.5 rounded-[20px] border border-[#1f6f78]/20" />
    </div>
  );
}

/* =============================================================
   سینی مسی و لاجوردی پشت حروف (مثل سینی چای)
============================================================= */

function PersianTray() {
  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 z-0 h-full w-full">
      <defs>
        <radialGradient id="trayBrass" cx="35%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#f6dd93" />
          <stop offset="55%" stopColor="#c58f32" />
          <stop offset="100%" stopColor="#855618" />
        </radialGradient>
        <radialGradient id="trayLapis" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="#2b6c8c" />
          <stop offset="100%" stopColor="#11334f" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="156" r="146" fill="rgba(60,35,10,0.22)" />
      <circle cx="150" cy="150" r="148" fill="url(#trayBrass)" />
      <circle cx="150" cy="150" r="141" fill="none" stroke="#7a4d14" strokeWidth="1.2" opacity="0.55" />
      <circle cx="150" cy="150" r="136" fill="url(#trayLapis)" />
      <circle
        cx="150"
        cy="150"
        r="130"
        fill="none"
        stroke="#e6c46a"
        strokeWidth="1"
        strokeDasharray="2 5"
        opacity="0.7"
      />

      {/* گلبرگ‌های اسلیمی دور سینی */}
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse
          key={i}
          cx="150"
          cy="38"
          rx="7"
          ry="16"
          transform={`rotate(${i * 22.5} 150 150)`}
          fill="#2bb3a8"
          opacity="0.14"
        />
      ))}
      <circle cx="150" cy="150" r="120" fill="none" stroke="#e6c46a" strokeWidth="1" opacity="0.22" />
      <circle cx="150" cy="150" r="66" fill="none" stroke="#e6c46a" strokeWidth="1" opacity="0.22" />

      {/* شمسه‌ی مرکزی (زیر دکمه جابجایی) */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="150"
          cy="108"
          rx="5"
          ry="13"
          transform={`rotate(${i * 30} 150 150)`}
          fill="#e6c46a"
          opacity="0.2"
        />
      ))}
      <circle cx="150" cy="150" r="33" fill="#0e2a43" opacity="0.55" />
    </svg>
  );
}

type DisplayLetter = {
  letter: string;
  originalIndex: number;
};

type TutorialStep = 0 | 1 | 2 | 3;

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export default function TablePage() {
  const [theme, setTheme] = useState<Theme>("classic");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [showLevelMap, setShowLevelMap] = useState(false);

  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedLetterIndexes, setSelectedLetterIndexes] = useState<number[]>(
    []
  );
  const [helpedPositions, setHelpedPositions] = useState<number[]>([]);
  const [displayLetters, setDisplayLetters] = useState<DisplayLetter[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundBonusWordsByLevel, setFoundBonusWordsByLevel] = useState<
    Record<number, string[]>
  >({});
  const [coins, setCoins] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(0);
  const [tutorialTarget, setTutorialTarget] = useState<Rect | null>(null);
  const [tutorialCard, setTutorialCard] = useState<Rect | null>(null);

  // حالت کشیدن انگشت (فقط تم سنتی)
  const [isDragging, setIsDragging] = useState(false);
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [gathered, setGathered] = useState(false); // حروف وسط سینی جمع شده‌اند (انیمیشن جابجایی)
  const shuffleBusyRef = useRef(false);

  const wordsRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const findButtonRef = useRef<HTMLButtonElement>(null);
  const coinJarRef = useRef<HTMLDivElement>(null);
  const tutorialCardRef = useRef<HTMLDivElement>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelNodesRef = useRef<WheelNode[]>([]);
  const selRef = useRef<number[]>([]);
  const flashTimerRef = useRef<number | undefined>(undefined);
  const gestureRef = useRef<{
    active: boolean;
    pointerId: number;
    startLen: number;
    last: { x: number; y: number } | null;
  }>({ active: false, pointerId: -1, startLen: 0, last: null });

  const bonusRewardedRef = useRef<Record<number, Set<string>>>({});

  const level = getTableLevel(currentLevel);
  const currentWord = normalizeWord(selectedLetters.join(""));
  const isPersian = theme === "persian";

  // انتخاب فعلی را هم در state و هم در ref نگه می‌داریم
  // (ref برای رویدادهای سریع کشیدن انگشت، بدون stale شدن)
  const applySelection = (indexes: number[]) => {
    selRef.current = indexes;
    setSelectedLetterIndexes(indexes);
    setSelectedLetters(indexes.map((i) => level?.letters[i] ?? ""));
  };

  const resetSelection = () => {
    applySelection([]);
    setHelpedPositions([]);
  };

  // موقعیت حروف روی دایره (به ترتیب displayLetters، پس «جابجایی» جای حروف را عوض می‌کند)
  const letterCount = displayLetters.length;
  const nodeRadius =
    letterCount > 1
      ? Math.min(
          WHEEL_MAX_NODE_R,
          WHEEL_RADIUS * Math.sin(Math.PI / letterCount) * 0.88
        )
      : WHEEL_MAX_NODE_R;

  const wheelNodes: WheelNode[] = displayLetters.map((item, slot) => {
    const angle = -Math.PI / 2 + (slot / Math.max(letterCount, 1)) * Math.PI * 2;
    return {
      letter: item.letter,
      originalIndex: item.originalIndex,
      x: WHEEL_SIZE / 2 + WHEEL_RADIUS * Math.cos(angle),
      y: WHEEL_SIZE / 2 + WHEEL_RADIUS * Math.sin(angle),
      r: nodeRadius,
      hitR: nodeRadius * 1.1,
    };
  });
  wheelNodesRef.current = wheelNodes;

  /* =========================================================
     LOAD GAME
  ========================================================= */

  useEffect(() => {
    // یک‌بار اطلاعات پیشرفت قدیمی را پاک می‌کنیم تا منطق جدید نقشه مراحل
    // و محاسبه ستاره‌ها از صفر شروع شود. موجودی سکه حفظ می‌شود.
    const migrationDone = localStorage.getItem(GAME_MIGRATION_KEY);

    if (!migrationDone) {
      localStorage.removeItem(BONUS_WORDS_KEY);
      localStorage.removeItem(STARS_KEY);
      localStorage.removeItem(MAX_LEVEL_KEY);

      localStorage.setItem(LEVEL_KEY, "1");
      localStorage.setItem(GAME_MIGRATION_KEY, "1");
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "persian" || savedTheme === "classic") {
      setTheme(savedTheme);
    }

    const savedCoins = readNumber(COINS_KEY);
    if (savedCoins !== null && savedCoins >= 0) {
      setCoins(savedCoins);
    }

    const savedLevel = readNumber(LEVEL_KEY);
    if (
      savedLevel !== null &&
      Number.isInteger(savedLevel) &&
      savedLevel >= 1 &&
      savedLevel <= TOTAL_LEVELS
    ) {
      setCurrentLevel(savedLevel);
    }

    const savedMaxLevel = readNumber(MAX_LEVEL_KEY);
    const restoredMaxLevel =
      savedMaxLevel !== null &&
      Number.isInteger(savedMaxLevel) &&
      savedMaxLevel >= 1 &&
      savedMaxLevel <= TOTAL_LEVELS
        ? savedMaxLevel
        : savedLevel !== null &&
          Number.isInteger(savedLevel) &&
          savedLevel >= 1 &&
          savedLevel <= TOTAL_LEVELS
          ? savedLevel
          : 1;

    setMaxUnlockedLevel(restoredMaxLevel);

    const savedStars = readJSON<Record<string, unknown>>(STARS_KEY, {});
    if (savedStars && typeof savedStars === "object" && !Array.isArray(savedStars)) {
      const cleaned: Record<number, number> = {};

      Object.entries(savedStars).forEach(([key, value]) => {
        const levelNumber = Number(key);
        const stars = Number(value);

        if (
          Number.isInteger(levelNumber) &&
          Number.isInteger(stars) &&
          levelNumber >= 1 &&
          levelNumber <= TOTAL_LEVELS &&
          stars >= 1 &&
          stars <= 3
        ) {
          cleaned[levelNumber] = stars;
        }
      });

      setLevelStars(cleaned);
    }

    const savedBonusWords = readJSON<Record<string, unknown>>(
      BONUS_WORDS_KEY,
      {}
    );
    if (
      savedBonusWords &&
      typeof savedBonusWords === "object" &&
      !Array.isArray(savedBonusWords)
    ) {
      const cleaned: Record<number, string[]> = {};

      Object.entries(savedBonusWords).forEach(([key, words]) => {
        const levelNumber = Number(key);

        if (Number.isInteger(levelNumber) && Array.isArray(words)) {
          cleaned[levelNumber] = Array.from(
            new Set(
              words
                .filter((word): word is string => typeof word === "string")
                .map(normalizeWord)
                .filter(Boolean)
            )
          );
        }
      });

      setFoundBonusWordsByLevel(cleaned);

      const restored: Record<number, Set<string>> = {};

      Object.entries(cleaned).forEach(([key, words]) => {
        restored[Number(key)] = new Set(words);
      });

      bonusRewardedRef.current = restored;
    }

    const tutorialSeen = localStorage.getItem(TUTORIAL_KEY);

    if (tutorialSeen) {
      window.setTimeout(() => {
        setShowLevelMap(true);
      }, 350);
    } else {
      window.setTimeout(() => {
        setTutorialStep(0);
        setShowTutorial(true);
      }, 350);
    }

    setLoaded(true);
  }, []);

  /* =========================================================
     SAVE
  ========================================================= */

  useEffect(() => {
    if (loaded) writeLocal(COINS_KEY, String(coins));
  }, [coins, loaded]);

  useEffect(() => {
    if (loaded) writeLocal(LEVEL_KEY, String(currentLevel));
  }, [currentLevel, loaded]);

  useEffect(() => {
    if (loaded) writeLocal(MAX_LEVEL_KEY, String(maxUnlockedLevel));
  }, [maxUnlockedLevel, loaded]);

  useEffect(() => {
    if (loaded) writeLocal(STARS_KEY, levelStars);
  }, [levelStars, loaded]);

  useEffect(() => {
    if (loaded) writeLocal(BONUS_WORDS_KEY, foundBonusWordsByLevel);
  }, [foundBonusWordsByLevel, loaded]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  /* =========================================================
     RESET LEVEL
  ========================================================= */

  useEffect(() => {
    if (!loaded || !level) return;

    applySelection([]);
    setHelpedPositions([]);
    setFoundWords([]);
    setMessage("");
    setShowWin(false);
    setFlash(null);
    setIsDragging(false);
    setDragPoint(null);
    gestureRef.current.active = false;

    setDisplayLetters(
      level.letters.map((letter, originalIndex) => ({
        letter,
        originalIndex,
      }))
    );

  }, [currentLevel, loaded]);

  /* =========================================================
     TUTORIAL TARGET
  ========================================================= */

  useEffect(() => {
    if (!showTutorial) return;

    // در تم سنتی دکمه «پیدا کن» وجود ندارد؛ مرحله ۳ آموزش روی چرخ حروف می‌افتد
    const targetRef =
      tutorialStep === 0
        ? wordsRef
        : tutorialStep === 1
          ? lettersRef
          : tutorialStep === 2
            ? isPersian
              ? lettersRef
              : findButtonRef
            : coinJarRef;

    const updatePosition = () => {
      const target = targetRef.current;
      const card = tutorialCardRef.current;

      if (!target) return;

      const targetRect = target.getBoundingClientRect();

      setTutorialTarget({
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      });

      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const gap = 22;
      const viewportPadding = 14;

      let top = targetRect.top - cardRect.height - gap;

      if (top < viewportPadding) {
        top = targetRect.bottom + gap;
      }

      const left = Math.min(
        Math.max(
          viewportPadding,
          targetRect.left + targetRect.width / 2 - cardRect.width / 2
        ),
        window.innerWidth - cardRect.width - viewportPadding
      );

      setTutorialCard({
        top,
        left,
        width: cardRect.width,
        height: cardRect.height,
      });
    };

    const frame = window.requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showTutorial, tutorialStep, isPersian]);

  /* =========================================================
     TUTORIAL AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (!showTutorial) return;

    const durations = [3600, 4000, 3800, 4400];

    const timer = window.setTimeout(() => {
      if (tutorialStep < 3) {
        setTutorialStep((current) => (current + 1) as TutorialStep);
      } else {
        localStorage.setItem(TUTORIAL_KEY, "true");
        setShowTutorial(false);
      }
    }, durations[tutorialStep]);

    return () => window.clearTimeout(timer);
  }, [showTutorial, tutorialStep]);

  const skipTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!loaded || !level) {
    return (
      <main
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-purple-50"
      >
        <LetterBackdrop />
        <div className="relative z-10 text-center">
          <div
            
            
            className="mb-3 text-5xl"
          >
            🧩
          </div>
          <p className="font-bold text-slate-600">در حال آماده‌سازی بازی...</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     THEME
  ========================================================= */

  const toggleTheme = () => {
    const next: Theme = theme === "classic" ? "persian" : "classic";

    setTheme(next);
    writeLocal(THEME_KEY, next);

    // با عوض شدن تم، انتخاب نیمه‌کاره پاک می‌شود (منطق بازی تغییری نمی‌کند)
    resetSelection();
    setFlash(null);
    setIsDragging(false);
    setDragPoint(null);
    gestureRef.current.active = false;
    setMessage("");
  };

  /* =========================================================
     GAME ACTIONS
  ========================================================= */

  const handleLetterClick = (letter: string, originalIndex: number) => {
    if (selRef.current.includes(originalIndex)) return;

    applySelection([...selRef.current, originalIndex]);
    setMessage("");
  };

  const clearWord = () => {
    resetSelection();
    setMessage("");
  };

  const removeLastLetter = () => {
    if (!selectedLetters.length) return;

    const lastPosition = selectedLetters.length - 1;
    const lastLetterWasHelped = helpedPositions.includes(lastPosition);

    if (lastLetterWasHelped) {
      setMessage("حرفی که با کمک باز شد قابل حذف نیست؛ برای شروع دوباره «پاک» را بزن.");
      return;
    }

    applySelection(selRef.current.slice(0, -1));
    setMessage("");
  };

  const shuffleLetters = () => {
    if (displayLetters.length < 2 || shuffleBusyRef.current) return;

    const shuffled = [...displayLetters];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const sameOrder = shuffled.every(
      (item, index) => item.originalIndex === displayLetters[index].originalIndex
    );

    if (sameOrder) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }

    if (isPersian) {
      // اول حروف وسط سینی جمع می‌شوند، بعد با ترتیب جدید پخش می‌شوند
      shuffleBusyRef.current = true;
      setGathered(true);

      window.setTimeout(() => {
        setDisplayLetters(shuffled);
        setGathered(false);

        window.setTimeout(() => {
          shuffleBusyRef.current = false;
        }, 550);
      }, 420);
    } else {
      setDisplayLetters(shuffled);
    }

    setMessage("");
  };

  /* =========================================================
     HELP
  ========================================================= */

  const useHelp = () => {
    if (coins < 5) {
      setMessage("برای استفاده از کمک حداقل ۵ سکه لازم داری 🪙");
      return;
    }

    const remainingWords = level.words.filter(
      (word) =>
        !foundWords.some(
          (foundWord) => normalizeWord(foundWord) === normalizeWord(word)
        )
    );

    if (!remainingWords.length) {
      setMessage("همه کلمات این مرحله را پیدا کردی 🎉");
      return;
    }

    const targetWord = normalizeWord(remainingWords[0]);

    // کمک فقط زمانی ادامه پیدا می‌کند که حروف فعلی، ابتدای همان کلمه باشند.
    // در این حالت حرف کمک‌شده دقیقاً به جای بعدی کلمه اضافه می‌شود و ثابت می‌ماند.
    const matchesTargetPrefix = selectedLetters.every(
      (letter, index) => normalizeWord(letter) === normalizeWord(targetWord[index] ?? "")
    );

    if (!matchesTargetPrefix || selectedLetters.length > targetWord.length) {
      setMessage(
        isPersian
          ? "این کلمه با حروف روشن‌شده نمی‌خواند؛ انگشتت را از روی حرف روشن بکش تا دوباره شروع شود."
          : "اول حروف اشتباه را پاک کن، سپس از کمک استفاده کن."
      );
      return;
    }

    const nextPosition = selectedLetters.length;

    if (nextPosition >= targetWord.length) {
      setMessage("کلمه فعلی کامل شده؛ آن را پیدا کن یا پاک کن.");
      return;
    }

    const targetLetter = targetWord[nextPosition];

    const helpIndex = level.letters.findIndex(
      (letter, index) =>
        normalizeWord(letter) === normalizeWord(targetLetter) &&
        !selectedLetterIndexes.includes(index)
    );

    if (helpIndex === -1) {
      setMessage("حرف لازم برای کمک در این مرحله در دسترس نیست؛ کلمه را پاک کن.");
      return;
    }

    setCoins((current) => current - 5);

    // حرف کمک‌شده دقیقاً در جای خودش قرار می‌گیرد.
    applySelection([...selRef.current, helpIndex]);

    // موقعیت این حرف از این لحظه قفل است و دکمه حذف نمی‌تواند آن را بردارد.
    setHelpedPositions((current) => [...current, nextPosition]);

    setMessage("💡 یک حرف از کلمه روشن شد و ثابت ماند!");
  };

  /* =========================================================
     SUBMIT WORD
     (همان منطق قبلی؛ فقط یک نتیجه هم برمی‌گرداند تا رنگ خط مشخص شود)
  ========================================================= */

  const submitWord = (wordOverride?: string): SubmitResult => {
    const wordToCheck = wordOverride ?? currentWord;

    if (!wordToCheck) return "wrong";

    const normalizedCurrentWord = normalizeWord(wordToCheck);

    const mainWord = level.words.find(
      (word) => normalizeWord(word) === normalizedCurrentWord
    );

    if (mainWord) {
      const alreadyFound = foundWords.some(
        (word) => normalizeWord(word) === normalizedCurrentWord
      );

      if (alreadyFound) {
        setMessage("این کلمه را قبلاً پیدا کردی.");
        resetSelection();
        return "duplicate";
      }

      const nextFoundCount = foundWords.length + 1;

      setFoundWords((current) => [...current, mainWord]);

      resetSelection();

      setMessage("آفرین! کلمه درست است 🎉");

      if (nextFoundCount === level.words.length) {
        window.setTimeout(() => {
          const bonusCount = bonusRewardedRef.current[currentLevel]?.size ?? 0;

          const stars = bonusCount >= 5 ? 3 : bonusCount >= 1 ? 2 : 1;
          const reward = getLevelReward(currentLevel);

          const rewardedLevels = readJSON<Record<number, boolean>>(
            LEVEL_REWARDS_KEY,
            {}
          );

          if (reward > 0 && !rewardedLevels[currentLevel]) {
            rewardedLevels[currentLevel] = true;
            writeLocal(LEVEL_REWARDS_KEY, rewardedLevels);
            setCoins((current) => current + reward);
          }

          setLevelStars((current) => ({
            ...current,
            [currentLevel]: Math.max(current[currentLevel] ?? 0, stars),
          }));

          if (currentLevel < TOTAL_LEVELS) {
            setMaxUnlockedLevel((current) => Math.max(current, currentLevel + 1));
          }

          setShowWin(true);
        }, 600);
      }

      return "main";
    }

    /* =====================================================
       BONUS WORD
    ===================================================== */

    if (isBonusWord(currentLevel, normalizedCurrentWord)) {
      const currentBonusSet =
        bonusRewardedRef.current[currentLevel] ?? new Set<string>();

      if (currentBonusSet.has(normalizedCurrentWord)) {
        resetSelection();
        setMessage("این کلمه جایزه را قبلاً پیدا کردی.");
        return "duplicate";
      }

      currentBonusSet.add(normalizedCurrentWord);
      bonusRewardedRef.current[currentLevel] = currentBonusSet;

      setFoundBonusWordsByLevel((current) => ({
        ...current,
        [currentLevel]: [...(current[currentLevel] ?? []), normalizedCurrentWord],
      }));

      setCoins((current) => current + 1);

      resetSelection();

      setMessage("کلمه جایزه پیدا کردی! 🪙 +۱ سکه");

      return "bonus";
    }

    resetSelection();
    return "wrong";
  };

  /* =========================================================
     SWIPE (تم سنتی) — کشیدن انگشت روی حروف
  ========================================================= */

  // وضعیت یک کلمه: درست؟ تکراری؟ یا هنوز نه
  const getWordStatus = (word: string): WordStatus => {
    if (!word) return "none";

    const normalized = normalizeWord(word);

    const main = level.words.find((w) => normalizeWord(w) === normalized);
    if (main) {
      return foundWords.some((f) => normalizeWord(f) === normalized)
        ? "duplicate"
        : "main";
    }

    if (isBonusWord(currentLevel, normalized)) {
      return bonusRewardedRef.current[currentLevel]?.has(normalized)
        ? "duplicate"
        : "bonus";
    }

    return "none";
  };

  const toWheelPoint = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: ((e.clientX - rect.left) / rect.width) * WHEEL_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * WHEEL_SIZE,
    };
  };

  const hitTestLetter = (point: { x: number; y: number }) =>
    wheelNodesRef.current.find(
      (node) => Math.hypot(node.x - point.x, node.y - point.y) <= node.hitR
    );

  const processWheelPoint = (point: { x: number; y: number }) => {
    const node = hitTestLetter(point);
    if (!node) return;

    const current = selRef.current;
    const existing = current.indexOf(node.originalIndex);

    // حرف جدید → به مسیر اضافه شود
    if (existing === -1) {
      applySelection([...current, node.originalIndex]);
      return;
    }

    // برگشتن روی حرف یکی‌مانده‌به‌آخر → آخرین حرف حذف شود
    // (حرف‌های کمک‌شده هیچ‌وقت حذف نمی‌شوند)
    const minLen = Math.max(gestureRef.current.startLen, 1);

    if (existing === current.length - 2 && current.length - 1 >= minLen) {
      applySelection(current.slice(0, -1));
    }
  };

  const handleWheelPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (showWin || showTutorial || showLevelMap) return;
    if (foundWords.length === level.words.length) return;
    if (shuffleBusyRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const point = toWheelPoint(e);
    const node = hitTestLetter(point);
    if (!node) return;

    const current = selRef.current;

    // اگر حرف کمک‌شده روشن است، باید از آخرین حرف روشن ادامه داد
    if (current.length > 0) {
      if (current[current.length - 1] !== node.originalIndex) {
        setMessage("از حرف روشن‌شده شروع کن و ادامه بده.");
        return;
      }
    } else {
      applySelection([node.originalIndex]);
    }

    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    setFlash(null);

    gestureRef.current = {
      active: true,
      pointerId: e.pointerId,
      startLen: current.length,
      last: point,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    setIsDragging(true);
    setDragPoint(point);
    setMessage("");
  };

  const handleWheelPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.active || gesture.pointerId !== e.pointerId) return;

    const point = toWheelPoint(e);
    const last = gesture.last ?? point;

    // اگر انگشت سریع حرکت کند، بین دو نقطه نمونه‌گیری می‌کنیم تا حرفی جا نماند
    const distance = Math.hypot(point.x - last.x, point.y - last.y);
    const steps = Math.max(1, Math.ceil(distance / 6));

    for (let i = 1; i <= steps; i++) {
      processWheelPoint({
        x: last.x + ((point.x - last.x) * i) / steps,
        y: last.y + ((point.y - last.y) * i) / steps,
      });
    }

    gesture.last = point;
    setDragPoint(point);
  };

  const finishWheelGesture = (
    e: ReactPointerEvent<HTMLDivElement>,
    cancelled: boolean
  ) => {
    const gesture = gestureRef.current;
    if (!gesture.active || gesture.pointerId !== e.pointerId) return;

    gesture.active = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    setIsDragging(false);
    setDragPoint(null);

    const path = selRef.current;

    if (cancelled) {
      applySelection(path.slice(0, gesture.startLen));
      return;
    }

    // چیزی اضافه نشده یا فقط یک حرف لمس شده → کلمه‌ای ثبت نمی‌شود
    if (path.length <= gesture.startLen || path.length < 2) {
      if (gesture.startLen === 0) applySelection([]);
      return;
    }

    const word = normalizeWord(path.map((i) => level.letters[i]).join(""));
    const result = submitWord(word);

    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);

    setFlash({ path, status: result, word });

    flashTimerRef.current = window.setTimeout(() => {
      setFlash(null);
    }, 650);
  };

  /* =========================================================
     LEVEL NAVIGATION
  ========================================================= */

  const selectLevel = (levelNumber: number) => {
    if (levelNumber < 1 || levelNumber > maxUnlockedLevel || levelNumber > TOTAL_LEVELS) {
      return;
    }

    setShowLevelMap(false);
    setCurrentLevel(levelNumber);
    setMessage("");
  };

  const goToNextLevel = () => {
    if (foundWords.length !== level.words.length) return;

    if (currentLevel >= TOTAL_LEVELS) {
      setShowWin(false);
      setMessage("🎉 همه مراحل را تمام کردی!");
      return;
    }

    setShowWin(false);
    setCurrentLevel((current) => current + 1);
  };

  const currentBonusCount = foundBonusWordsByLevel[currentLevel]?.length ?? 0;
  const currentStars = levelStars[currentLevel] ?? 0;

  /* =========================================================
     DERIVED (رنگ خط و مسیر فعال)
  ========================================================= */

  const flashing = !isDragging && flash !== null;
  const activePath = flashing && flash ? flash.path : selectedLetterIndexes;

  const statusKey: string =
    flashing && flash ? flash.status : getWordStatus(currentWord);

  const lineColor = LINE_COLORS[statusKey] ?? LINE_COLORS.none;

  const linePoints: { x: number; y: number }[] = activePath
    .map((index) => wheelNodes.find((node) => node.originalIndex === index))
    .filter((node): node is WheelNode => Boolean(node))
    .map((node) => ({ x: node.x, y: node.y }));

  if (isDragging && dragPoint && linePoints.length > 0) {
    linePoints.push(dragPoint);
  }

  const pillWord = flashing && flash ? flash.word : currentWord;

  /* =========================================================
     TUTORIAL CONTENT
  ========================================================= */

  const tutorialSteps = [
    {
      icon: "👀",
      title: "اول این قسمت را ببین",
      text: "کلمه‌هایی که باید پیدا کنی اینجا نمایش داده می‌شوند.",
      hint: "اینجا جای کلمات است",
    },
    {
      icon: "👆",
      title: isPersian ? "انگشتت را روی یک حرف بگذار" : "حالا حروف را انتخاب کن",
      text: isPersian
        ? "حروف روی سینی چیده شده‌اند. انگشتت را روی اولین حرف کلمه بگذار."
        : "روی حروفی که می‌خواهی به ترتیب کلیک کن تا کلمه ساخته شود.",
      hint: isPersian ? "از اینجا شروع کن" : "از اینجا شروع کن",
    },
    isPersian
      ? {
          icon: "🫳",
          title: "حروف را به هم وصل کن",
          text: "بدون برداشتن انگشت، روی حروف بعدی بکش. خط نارنجی یعنی هنوز کلمه درست نشده و سبز یعنی درست است. انگشتت را که برداری، کلمه ثبت می‌شود.",
          hint: "بکش و رها کن",
        }
      : {
          icon: "👇",
          title: "بعد «پیدا کن» را بزن",
          text: "وقتی کلمه کامل شد، این دکمه را بزن تا کلمه بررسی شود.",
          hint: "اینجا کلیک کن",
        },
    {
      icon: "🪙",
      title: "کلمات جایزه را هم پیدا کن",
      text: "اگر کلمه اضافه‌ای پیدا کنی، جایزه می‌گیری و یک سکه به کوزه‌ات اضافه می‌شود.",
      hint: "+۱ سکه",
    },
  ];

  const tutorialData = tutorialSteps[tutorialStep];

  const arrowTop =
    tutorialCard && tutorialTarget
      ? tutorialTarget.top > tutorialCard.top + tutorialCard.height
        ? tutorialCard.top + tutorialCard.height + 5
        : tutorialTarget.top - 40
      : 0;

  const arrowLeft = tutorialTarget
    ? tutorialTarget.left + tutorialTarget.width / 2
    : 0;

  /* =========================================================
     LEVEL MAP
  ========================================================= */

  const mapLevels = Array.from({ length: TOTAL_LEVELS }, (_, index) => index + 1);

  /* =========================================================
     THEME CLASSES
  ========================================================= */

  const headerBtn = isPersian
    ? "bg-[#fbf3de]/95 ring-1 ring-[#d8aa45]/60 text-[#6b4a1e]"
    : "bg-white/90 ring-1 ring-slate-200";

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main
      dir="rtl"
      className={`relative isolate min-h-[100dvh] overflow-x-hidden overflow-y-auto px-3 py-2 pb-4 text-slate-800 sm:min-h-screen sm:overflow-visible sm:px-6 sm:py-8 ${
        isPersian ? "bg-[#f3e9d2]" : "bg-[#f5f7fb]"
      }`}
    >
      <style>{`
        @keyframes kalamakSlotIn {
          0% { transform: scale(0.7); opacity: 0.3; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {isPersian ? (
        <PersianBackdrop />
      ) : (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50" />
          <LetterBackdrop />

          {/* هاله‌های نرم رنگی برای عمق بیشتر */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
          </div>
        </>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col sm:min-h-[calc(100vh-4rem)]">
        {/* HEADER */}
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-5">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/games";
            }}
            className={`flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold shadow-sm transition sm:px-4 sm:py-2.5 sm:text-sm ${headerBtn} ${
              isPersian ? "hover:text-[#3d2710]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>→</span>
            منوی اصلی
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLevelMap(true)}
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${headerBtn} ${
                isPersian ? "text-[#1f6f78]" : "text-indigo-600"
              }`}
            >
              <span>🗺️</span>
              مراحل
            </button>

            {/* دکمه تغییر تم */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="تغییر تم بازی"
              title={isPersian ? "برگشت به تم ساده" : "تم سنتی ایرانی"}
              className={`flex h-9 items-center justify-center gap-1.5 rounded-2xl px-3 text-xs font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-10 sm:text-sm ${
                isPersian
                  ? "bg-gradient-to-br from-[#1f6f78] to-[#14507a] text-[#fff3cf] ring-1 ring-[#d8aa45]/70"
                  : "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 ring-1 ring-amber-200"
              }`}
            >
              <span className="text-base">{isPersian ? "🧩" : "🏺"}</span>
              <span className="hidden sm:inline">{isPersian ? "تم ساده" : "تم سنتی"}</span>
            </button>
          </div>

          <div className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 shadow-sm sm:gap-2 sm:px-4 sm:py-2.5 ${headerBtn}`}>
            <span className="text-lg">🪙</span>
            <span className={`font-black ${isPersian ? "text-[#6b4a1e]" : "text-slate-700"}`}>{coins}</span>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-2 text-center sm:mb-5">
          <div
            
            
            className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-[18px] text-2xl shadow-lg sm:mb-3 sm:h-16 sm:w-16 sm:rounded-[22px] sm:text-3xl ${
              isPersian
                ? "bg-gradient-to-br from-[#1f6f78] to-[#14507a] shadow-teal-900/20 ring-2 ring-[#d8aa45]/70"
                : "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-indigo-200"
            }`}
          >
            {isPersian ? "🏺" : "🧩"}
          </div>

          <p className={`text-xs font-bold ${isPersian ? "text-[#b8892f]" : "text-indigo-500"}`}>
            {isPersian ? "✦ کَلَمَک ✦" : "کَلَمَک"}
          </p>

          <h1
            className={`mt-0.5 bg-gradient-to-l bg-clip-text text-2xl font-black text-transparent sm:mt-1 sm:text-4xl ${
              isPersian
                ? "from-[#14507a] via-[#1f6f78] to-[#b8892f]"
                : "from-indigo-600 via-violet-600 to-purple-600"
            }`}
          >
            مرحله {currentLevel}
          </h1>

          <p className={`mt-1 text-xs sm:mt-2 sm:text-sm ${isPersian ? "text-[#7a5a2b]" : "text-slate-500"}`}>
            {isPersian
              ? "انگشتت را روی حروف بکش و کلمات را پیدا کن"
              : "حروف را به هم وصل کن و کلمات را پیدا کن"}
          </p>
        </div>

        {/* WORDS */}
        <div
          ref={wordsRef}
          className={`mb-2 rounded-[28px] p-3 shadow-md sm:mb-5 sm:rounded-[32px] sm:p-6 ${
            isPersian
              ? "bg-[#fbf3de]/90 ring-1 ring-[#d8aa45]/50"
              : "bg-white/90 ring-1 ring-slate-200"
          }`}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {level.words.map((word) => {
              const found = foundWords.some(
                (foundWord) => normalizeWord(foundWord) === normalizeWord(word)
              );

              const slotClass = isPersian
                ? found
                  ? "border-[#c58f32] bg-gradient-to-b from-[#2aa198] to-[#1c7c78] text-[#fff8e6] shadow-md"
                  : "border-[#e2cfa0] bg-[#fbf3de] text-[#c9b27a]"
                : found
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-slate-100 bg-slate-50 text-slate-300";

              return (
                <div
                  key={word}
                  style={found && isPersian ? { animation: "kalamakSlotIn 0.45s ease-out" } : undefined}
                  className={`flex min-h-[44px] items-center justify-center rounded-2xl border-2 px-2 text-center text-sm font-black transition-all sm:min-h-[58px] sm:px-3 sm:text-base ${slotClass}`}
                >
                  {found ? word : word.split("").map(() => "•").join(" ")}
                </div>
              );
            })}
          </div>

          {!isPersian && (
            <div className="mt-2 flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50 px-4">
              {currentWord ? (
                <span
                  key={currentWord}
                  
                  
                  className="text-xl font-black tracking-[0.2em] text-indigo-600 sm:text-2xl sm:tracking-[0.25em]"
                >
                  {currentWord}
                </span>
              ) : (
                <span className="text-sm font-bold text-slate-400">کلمه را بساز</span>
              )}
            </div>
          )}

          <div className="mt-1 flex min-h-6 items-center justify-center sm:mt-3 sm:min-h-8">
            {message && (
              <div
                
                
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold sm:px-4 sm:py-2 sm:text-xs ${
                  message.includes("قبلاً")
                    ? "bg-amber-50 text-amber-700"
                    : message.includes("درست") ||
                      message.includes("جایزه") ||
                      message.includes("روشن")
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* LETTERS */}
        {isPersian ? (
          /* ===================== تم سنتی: چرخ حروف روی سینی ===================== */
          <div className="relative z-20 flex flex-col items-center">
            {/* نمایش کلمه‌ای که در حال ساخته شدن است */}
            <div className="mb-3 flex h-12 items-center justify-center">
              {pillWord ? (
                <span
                  key={pillWord}
                  className="rounded-full px-6 py-2 text-xl font-black tracking-[0.18em] text-white shadow-lg transition-colors duration-150 sm:text-2xl"
                  style={{
                    backgroundColor: lineColor,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                  }}
                >
                  {pillWord}
                </span>
              ) : (
                <span className="text-sm font-bold text-[#a98a52]">
                  حروف را به هم وصل کن
                </span>
              )}
            </div>

            <div ref={lettersRef} className="w-[min(88vw,330px)]">
              <div
                ref={wheelRef}
                onPointerDown={handleWheelPointerDown}
                onPointerMove={handleWheelPointerMove}
                onPointerUp={(e) => finishWheelGesture(e, false)}
                onPointerCancel={(e) => finishWheelGesture(e, true)}
                onContextMenu={(e) => e.preventDefault()}
                className="relative aspect-square w-full select-none"
                style={{
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  containerType: "inline-size",
                }}
              >
                <PersianTray />

                {/* خط بین حروف */}
                <svg
                  viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                  className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                >
                  {!gathered && linePoints.length >= 2 && (
                    <>
                      <polyline
                        points={linePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth={17}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points={linePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={11}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "stroke 0.15s" }}
                      />
                    </>
                  )}
                </svg>

                {/* حروف */}
                {wheelNodes.map((node) => {
                  const position = activePath.indexOf(node.originalIndex);
                  const selected = position !== -1;
                  const helped =
                    selected && !flashing && helpedPositions.includes(position);

                  return (
                    <div
                      key={`${node.letter}-${node.originalIndex}`}
                      className="pointer-events-none absolute z-[2] flex items-center justify-center rounded-full font-black leading-none"
                      style={{
                        left: gathered ? "50%" : `${(node.x / WHEEL_SIZE) * 100}%`,
                        top: gathered ? "50%" : `${(node.y / WHEEL_SIZE) * 100}%`,
                        transition:
                          "left 0.45s cubic-bezier(0.34, 1.25, 0.5, 1), top 0.45s cubic-bezier(0.34, 1.25, 0.5, 1), transform 0.45s ease, background-color 0.15s",
                        width: `${((node.r * 2) / WHEEL_SIZE) * 100}%`,
                        height: `${((node.r * 2) / WHEEL_SIZE) * 100}%`,
                        transform: `translate(-50%, -50%) scale(${gathered ? 0.45 : selected ? 1.08 : 1}) rotate(${gathered ? 180 : 0}deg)`,
                        backgroundColor: selected
                          ? helped
                            ? "#e0a82e"
                            : lineColor
                          : "#f7edd3",
                        color: selected ? "#ffffff" : "#4a2c12",
                        fontSize: `${node.r * 0.34}cqw`,
                        border: `3px solid ${
                          selected ? "rgba(255,255,255,0.9)" : "#d8aa45"
                        }`,
                        boxShadow: "0 3px 8px rgba(0,0,0,0.32)",
                      }}
                    >
                      <span className="block leading-none">{node.letter}</span>
                    </div>
                  );
                })}

              </div>
            </div>

            <div className="mt-4 flex w-full max-w-[330px] items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={shuffleLetters}
                disabled={displayLetters.length < 2}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 text-xs font-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:gap-2 sm:text-sm"
                style={{
                  background: "linear-gradient(180deg, #2aa198 0%, #14507a 100%)",
                  color: "#fff3cf",
                  border: "2px solid #d8aa45",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(20,80,122,0.35)",
                }}
                aria-label="جابجایی حروف"
                title="جابجایی حروف"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 7h3.5c3.5 0 5 10 9 10H21" />
                  <path d="M3 17h3.5c1.6 0 2.8-1.4 3.8-3.2" />
                  <path d="M13.7 9.2C14.7 7.9 15.8 7 17.5 7H21" />
                  <path d="m18.5 4 2.5 3-2.5 3" />
                  <path d="m18.5 14 2.5 3-2.5 3" />
                </svg>
                <span>جابجایی</span>
              </button>

              <div
                ref={coinJarRef}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#fbf3de] px-2 shadow-lg ring-1 ring-[#d8aa45]/60 sm:h-12 sm:gap-2 sm:px-3"
              >
                <img
                  src="/pottery-svgrepo-com.svg"
                  alt="سکه"
                  className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                />
                <div className="min-w-0 text-center leading-none">
                  <p className="text-xs font-black text-[#b8892f] sm:text-sm">
                    {coins} سکه
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={useHelp}
                disabled={coins < 5 || foundWords.length === level.words.length}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 text-xs font-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:gap-2 sm:text-sm"
                style={{
                  background: "linear-gradient(180deg, #e6c46a 0%, #b9792a 100%)",
                  color: "#3d2710",
                  border: "2px solid #8a5a1a",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 12px rgba(138,90,26,0.35)",
                }}
              >
                <span className="text-base sm:text-lg">💡</span>
                <span>کمک</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs">
                  ۵ 🪙
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ===================== تم ساده (قبلی) ===================== */
          <div
            ref={lettersRef}
            className="relative z-20 rounded-[30px] bg-white p-3 shadow-lg ring-1 ring-slate-200 sm:rounded-[36px] sm:p-7"
          >
            <div className="mb-2 text-center sm:mb-6">
              <p className="text-xs font-bold text-slate-400">حروف مرحله</p>
            </div>

            <div className="mb-3 flex flex-wrap justify-center gap-2 sm:mb-7 sm:gap-4">
              {displayLetters.map(({ letter, originalIndex }) => {
                const selectedPosition = selectedLetterIndexes.indexOf(originalIndex);
                const selected = selectedPosition !== -1;
                const helped = selected && helpedPositions.includes(selectedPosition);

                return (
                  <button
                    key={`${letter}-${originalIndex}`}
                    type="button"
                    onClick={() => handleLetterClick(letter, originalIndex)}
                    className={`relative isolate flex h-[52px] w-[52px] items-center justify-center rounded-full border-[4px] text-xl font-black text-white shadow-md transition-all sm:h-[72px] sm:w-[72px] sm:border-[5px] sm:text-3xl ${
                      helped
                        ? "border-amber-200 ring-4 ring-amber-100"
                        : selected
                          ? "border-emerald-300"
                          : "border-indigo-100"
                    }`}
                    style={{
                      backgroundColor: helped
                        ? "#fbbf24"
                        : selected
                          ? "#34d399"
                          : "#6366f1",
                      color: "#ffffff",
                    }}
                  >
                    <span className="relative z-10 block leading-none text-white">{letter}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                type="button"
                
                onClick={removeLastLetter}
                disabled={!selectedLetters.some((_, index) => !helpedPositions.includes(index))}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-500 transition hover:bg-slate-200 disabled:opacity-30 sm:h-12 sm:w-12 sm:text-xl"
                aria-label="حذف آخرین حرف"
                title="حذف آخرین حرف"
              >
                ⌫
              </button>

              <button
                ref={findButtonRef}
                type="button"
                onClick={() => submitWord()}
                disabled={!currentWord}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl px-4 text-sm font-black shadow-lg shadow-indigo-100 transition sm:h-12 sm:px-6 sm:text-base"
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundColor: currentWord ? "#6366f1" : "#cbd5e1",
                  color: "#ffffff",
                  opacity: currentWord ? 1 : 0.55,
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#ffffff",
                    opacity: 1,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  پیدا کن
                </span>
              </button>

              <button
                type="button"
                
                onClick={clearWord}
                disabled={!selectedLetters.length}
                className="h-11 w-11 rounded-2xl bg-slate-100 text-[11px] font-black text-slate-500 transition hover:bg-slate-200 disabled:opacity-30 sm:h-12 sm:w-12 sm:text-xs"
                aria-label="پاک کردن کلمه"
                title="پاک کردن کلمه"
              >
                پاک
              </button>
            </div>

            <div className="mt-3 flex w-full items-center gap-2 sm:mt-4 sm:gap-3">
              <button
                type="button"
                
                onClick={shuffleLetters}
                disabled={displayLetters.length < 2}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-2 text-xs font-black text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:gap-2 sm:text-sm"
                aria-label="جابجایی حروف"
                title="جابجایی حروف"
              >
                <span className="text-base sm:text-lg">🔀</span>
                <span>جابجایی</span>
              </button>

              <div
                ref={coinJarRef}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white px-2 shadow-lg ring-1 ring-slate-200 sm:h-12 sm:gap-2 sm:px-3"
              >
                <img
                  src="/pottery-svgrepo-com.svg"
                  alt="سکه"
                  className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                />
                <div className="min-w-0 text-center leading-none">
                  <p className="text-xs font-black text-yellow-500 sm:text-sm">
                    {coins} سکه
                  </p>
                </div>
              </div>

              <button
                type="button"
                
                onClick={useHelp}
                disabled={coins < 5 || foundWords.length === level.words.length}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-2 text-xs font-black text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:gap-2 sm:text-sm"
              >
                <span className="text-base sm:text-lg">💡</span>
                <span>کمک</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs">
                  ۵ 🪙
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          LEVEL MAP MODAL — طراحی مینیمال (مسیر مارپیچ درست و هماهنگ با تم)
      ===================================================== */}

      {showLevelMap &&
        (() => {
          const columns = 5;
          const rowHeight = 92;
          const rows = Math.ceil(mapLevels.length / columns);
          const totalStars = Object.values(levelStars).reduce(
            (sum, value) => sum + value,
            0
          );

          // موقعیت هر مرحله: ردیف زوج از راست به چپ، ردیف فرد از چپ به راست (مارپیچ)
          // مرحله بعد از آخرین مرحله‌ی هر ردیف، دقیقاً زیر آن قرار می‌گیرد.
          const points = mapLevels.map((_, index) => {
            const row = Math.floor(index / columns);
            const j = index % columns;
            const col = row % 2 === 0 ? j : columns - 1 - j;

            return {
              row,
              col,
              // صفحه RTL است: ستون ۰ سمت راست قرار می‌گیرد
              x: (1 - (col + 0.5) / columns) * 100,
              y: ((row + 0.5) / rows) * 100,
            };
          });

          const buildPath = (count: number) => {
            let d = "";

            for (let i = 0; i < Math.min(count, points.length); i++) {
              const point = points[i];

              if (i === 0) {
                d = `M ${point.x} ${point.y}`;
                continue;
              }

              const prev = points[i - 1];

              if (prev.row === point.row) {
                d += ` L ${point.x} ${point.y}`;
              } else {
                // دور برگردان نرم در انتهای هر ردیف
                const bulge = prev.x < 50 ? -9 : 9;
                d += ` C ${prev.x + bulge} ${prev.y}, ${point.x + bulge} ${point.y}, ${point.x} ${point.y}`;
              }
            }

            return d;
          };

          const palette = isPersian
            ? {
                modal: "border-[#d8aa45]/50 bg-[#f7efdb]",
                bar: "border-[#d8aa45]/30 bg-[#fbf3de]/95",
                title: "text-[#3d2710]",
                sub: "text-[#1f6f78]",
                chip: "bg-[#efe3c6] text-[#6b4a1e]",
                chipStar: "bg-[#fbeab8] text-[#a8761c]",
                close: "border-[#d8aa45]/50 bg-[#fbf3de] text-[#8a6a35] hover:bg-[#efe3c6]",
                active:
                  "bg-gradient-to-br from-[#1f6f78] to-[#14507a] text-[#fff3cf] ring-4 ring-[#d8aa45]/45 shadow-lg shadow-teal-900/20",
                done: "bg-gradient-to-br from-[#2aa198] to-[#1c7c78] text-white shadow-md shadow-teal-900/15",
                open: "bg-[#fbf3de] text-[#6b4a1e] border-2 border-[#d8aa45] shadow-md hover:-translate-y-0.5",
                locked: "bg-[#efe3c6] text-[#cdb98a] border border-[#e2cfa0]",
                tag: "bg-[#14507a] text-[#fff3cf]",
                lineBase: "#e2cfa0",
                lineDone: "#1f8f87",
                note: "text-[#8a6a35]",
                cta: "bg-gradient-to-r from-[#2aa198] to-[#14507a] text-[#fff3cf] ring-1 ring-[#d8aa45]/70",
              }
            : {
                modal: "border-white/70 bg-[#f7f8fc]",
                bar: "border-slate-200/70 bg-white/95",
                title: "text-slate-800",
                sub: "text-indigo-500",
                chip: "bg-indigo-50 text-indigo-600",
                chipStar: "bg-amber-50 text-amber-500",
                close: "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
                active:
                  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-100 shadow-lg shadow-indigo-200",
                done: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-100",
                open: "bg-white text-slate-700 border-2 border-indigo-200 shadow-md hover:-translate-y-0.5",
                locked: "bg-slate-100 text-slate-300 border border-slate-200",
                tag: "bg-indigo-600 text-white",
                lineBase: "#dbe0ea",
                lineDone: "#818cf8",
                note: "text-slate-400",
                cta: "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white",
              };

          return (
            <div
              dir="rtl"
              className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-3 py-4"
            >
              <div
                className={`relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-[32px] border shadow-[0_30px_90px_rgba(15,23,42,0.30)] ${palette.modal}`}
              >
                {/* HEADER */}
                <div className={`relative z-20 border-b px-5 py-4 ${palette.bar}`}>
                  <button
                    type="button"
                    onClick={() => setShowLevelMap(false)}
                    className={`absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border text-lg font-black transition-all hover:scale-105 ${palette.close}`}
                    aria-label="بستن"
                  >
                    ×
                  </button>

                  <div className="text-center">
                    <p className={`text-[10px] font-black tracking-wide ${palette.sub}`}>
                      {isPersian ? "✦ مسیر پیشرفت ✦" : "مسیر پیشرفت"}
                    </p>

                    <h2 className={`mt-0.5 text-xl font-black sm:text-2xl ${palette.title}`}>
                      سفر کَلَمَک
                    </h2>

                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      <div className={`rounded-full px-3 py-1 text-[10px] font-black sm:text-xs ${palette.chip}`}>
                        مرحله {maxUnlockedLevel} از {TOTAL_LEVELS}
                      </div>

                      <div className={`rounded-full px-3 py-1 text-[10px] font-black sm:text-xs ${palette.chipStar}`}>
                        ⭐ {totalStars}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MAP AREA */}
                <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="relative mx-auto w-full max-w-[420px]" style={{ height: rows * rowHeight }}>
                    {/* مسیر: خط کم‌رنگ کل مسیر + خط پررنگ تا مرحله باز‌شده */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    >
                      <path
                        d={buildPath(points.length)}
                        fill="none"
                        stroke={palette.lineBase}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={buildPath(maxUnlockedLevel)}
                        fill="none"
                        stroke={palette.lineDone}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    <div
                      className="absolute inset-0 z-10 grid"
                      style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gridAutoRows: `${rowHeight}px`,
                      }}
                    >
                      {mapLevels.map((levelNumber, index) => {
                        const point = points[index];

                        const unlocked = levelNumber <= maxUnlockedLevel;
                        const completed = Boolean(levelStars[levelNumber]);
                        const stars = levelStars[levelNumber] ?? 0;
                        const active = levelNumber === currentLevel;

                        const levelReward = getLevelReward(levelNumber);
                        const bonusCoins =
                          foundBonusWordsByLevel[levelNumber]?.length ?? 0;
                        const totalLevelCoins = levelReward + bonusCoins;

                        const nodeClass = active
                          ? palette.active
                          : completed
                            ? palette.done
                            : unlocked
                              ? palette.open
                              : palette.locked;

                        return (
                          <div
                            key={levelNumber}
                            ref={(el) => {
                              if (el && active) {
                                el.scrollIntoView({ block: "center" });
                              }
                            }}
                            className="relative flex items-center justify-center"
                            style={{
                              gridColumn: point.col + 1,
                              gridRow: point.row + 1,
                            }}
                          >
                            {active && (
                              <span
                                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-black shadow-sm sm:text-[9px] ${palette.tag}`}
                                style={{ top: "calc(50% - 46px)" }}
                              >
                                اینجایی
                              </span>
                            )}

                            <button
                              type="button"
                              disabled={!unlocked}
                              onClick={() => selectLevel(levelNumber)}
                              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full font-black transition-all duration-200 sm:h-14 sm:w-14 ${nodeClass}`}
                            >
                              {unlocked ? (
                                <span className="text-lg sm:text-xl">{levelNumber}</span>
                              ) : (
                                <span className="text-base opacity-70">🔒</span>
                              )}
                            </button>

                            {completed && (
                              <div
                                className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center leading-none"
                                style={{ top: "calc(50% + 33px)" }}
                                title={`${totalLevelCoins} سکه از این مرحله`}
                              >
                                <span className="text-[8px]">{"⭐".repeat(stars)}</span>
                                <span className="mt-0.5 text-[8px] font-black text-yellow-600">
                                  🪙 {totalLevelCoins}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className={`relative z-20 border-t px-4 py-3.5 sm:px-5 ${palette.bar}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-[9px] font-medium sm:text-[10px] ${palette.note}`}>
                        ⭐⭐⭐ با پیدا کردن ۵ کلمه جایزه یا بیشتر
                      </p>
                      <p className={`mt-0.5 text-[9px] font-medium sm:text-[10px] ${palette.note}`}>
                        🪙 عدد زیر هر مرحله، جایزه سکه همان مرحله است
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowLevelMap(false);
                        setCurrentLevel(maxUnlockedLevel);
                      }}
                      className={`shrink-0 rounded-2xl px-4 py-2.5 text-[10px] font-black shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:text-xs ${palette.cta}`}
                    >
                      ادامه بازی →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* =====================================================
          TUTORIAL
      ===================================================== */}

      {showTutorial && tutorialTarget && (
        <div dir="rtl" className="pointer-events-none fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-slate-950/35" />

          <button
            type="button"
            onClick={skipTutorial}
            className="pointer-events-auto fixed right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-600 shadow-xl"
          >
            رد کردن
          </button>

          <div
            key={`target-${tutorialStep}`}
            
            
            
            className="absolute rounded-[28px] border-4 border-indigo-400 bg-indigo-400/10 shadow-[0_0_0_5px_rgba(99,102,241,0.18),0_0_35px_rgba(99,102,241,0.35)]"
            style={{
              top: tutorialTarget.top - 7,
              left: tutorialTarget.left - 7,
              width: tutorialTarget.width + 14,
              height: tutorialTarget.height + 14,
            }}
          />

          <div
            key={`arrow-${tutorialStep}`}
            
            
            
            className="absolute z-[102] -translate-x-1/2 text-5xl font-black leading-none text-indigo-600 drop-shadow-lg"
            style={{ top: arrowTop, left: arrowLeft }}
          >
            ↓
          </div>

          <div
            ref={tutorialCardRef}
            key={`card-${tutorialStep}`}
            
            
            
            className="absolute z-[103] w-[calc(100vw-28px)] max-w-[390px] rounded-[30px] border border-white/80 bg-white p-5 text-center shadow-[0_20px_70px_rgba(15,23,42,0.25)]"
            style={{
              top: tutorialCard?.top ?? 20,
              left: tutorialCard?.left ?? Math.max(14, (window.innerWidth - 390) / 2),
            }}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl shadow-sm">
              <span
                
                
              >
                {tutorialData.icon}
              </span>
            </div>

            <div className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-600">
              مرحله {tutorialStep + 1} از ۴
            </div>

            <h3 className="mt-2 text-xl font-black text-slate-800">{tutorialData.title}</h3>

            <p className="mx-auto mt-2 max-w-[330px] text-sm font-medium leading-7 text-slate-500">
              {tutorialData.text}
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-100">
              {tutorialData.hint}
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    step === tutorialStep ? "w-7 bg-indigo-500" : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          WIN MODAL
      ===================================================== */}

      {showWin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ backgroundColor: "rgba(15,23,42,0.50)" }}
        >
          <div
            
            
            className="w-full max-w-sm rounded-[36px] bg-white p-7 text-center shadow-2xl"
          >
            <div
              
              
              className="text-7xl"
            >
              🎉
            </div>

            <p className="mt-5 text-sm font-bold text-emerald-500">
              مرحله {currentLevel} کامل شد
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-800">عالی بود!</h2>

            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400">امتیاز این مرحله</p>

              <div className="mt-2 text-3xl tracking-[0.2em]">
                {"⭐".repeat(currentStars)}
                <span className="opacity-20">{"⭐".repeat(3 - currentStars)}</span>
              </div>

              <p className="mt-2 text-xs font-bold text-slate-500">
                {currentBonusCount >= 5
                  ? "۵ کلمه اضافه یا بیشتر؛ سه ستاره گرفتی!"
                  : currentBonusCount >= 1
                  ? "کلمه‌های اضافه پیدا کردی؛ دو ستاره گرفتی!"
                  : "مرحله را کامل کردی؛ یک ستاره گرفتی!"}
              </p>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              همه کلمات اصلی این مرحله را پیدا کردی.
            </p>

            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-yellow-50 px-5 py-2.5 text-sm font-black text-yellow-500">
              🪙 {coins} سکه
            </div>

            {currentLevel < TOTAL_LEVELS ? (
              <button
                type="button"
                onClick={goToNextLevel}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-4 font-black text-white shadow-lg shadow-emerald-100 transition hover:scale-[1.02] active:scale-95"
              >
                برو به مرحله {currentLevel + 1} →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowWin(false)}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-4 font-black text-white shadow-lg shadow-emerald-100"
              >
                پایان بازی 🎊
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setShowWin(false);
                setShowLevelMap(true);
              }}
              className="mt-3 w-full rounded-2xl bg-slate-100 py-3.5 text-sm font-black text-slate-600 transition hover:bg-slate-200"
            >
              🗺️ دیدن مسیر مراحل
            </button>
          </div>
        </div>
      )}
    </main>
  );
}