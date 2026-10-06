"use client";

import { useEffect, useRef, useState } from "react";
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

  const wordsRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const findButtonRef = useRef<HTMLButtonElement>(null);
  const coinJarRef = useRef<HTMLDivElement>(null);
  const tutorialCardRef = useRef<HTMLDivElement>(null);

  const bonusRewardedRef = useRef<Record<number, Set<string>>>({});

  const level = getTableLevel(currentLevel);
  const currentWord = normalizeWord(selectedLetters.join(""));

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

  /* =========================================================
     RESET LEVEL
  ========================================================= */

  useEffect(() => {
    if (!loaded || !level) return;

    setSelectedLetters([]);
    setSelectedLetterIndexes([]);
    setHelpedPositions([]);
    setFoundWords([]);
    setMessage("");
    setShowWin(false);

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

    const targetRef =
      tutorialStep === 0
        ? wordsRef
        : tutorialStep === 1
          ? lettersRef
          : tutorialStep === 2
            ? findButtonRef
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
  }, [showTutorial, tutorialStep]);

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
     GAME ACTIONS
  ========================================================= */

  const handleLetterClick = (letter: string, originalIndex: number) => {
    if (selectedLetterIndexes.includes(originalIndex)) return;

    setSelectedLetterIndexes((current) => [...current, originalIndex]);
    setSelectedLetters((current) => [...current, letter]);
    setMessage("");
  };

  const clearWord = () => {
    setSelectedLetters([]);
    setSelectedLetterIndexes([]);
    setHelpedPositions([]);
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

    setSelectedLetters((current) => current.slice(0, -1));
    setSelectedLetterIndexes((current) => current.slice(0, -1));
    setMessage("");
  };

  const shuffleLetters = () => {
    if (displayLetters.length < 2) return;

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

    setDisplayLetters(shuffled);
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
      setMessage("اول حروف اشتباه را پاک کن، سپس از کمک استفاده کن.");
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

    const helpLetter = level.letters[helpIndex];

    setCoins((current) => current - 5);

    // حرف کمک‌شده دقیقاً در جای خودش قرار می‌گیرد.
    setSelectedLetters((current) => [...current, helpLetter]);
    setSelectedLetterIndexes((current) => [...current, helpIndex]);

    // موقعیت این حرف از این لحظه قفل است و دکمه حذف نمی‌تواند آن را بردارد.
    setHelpedPositions((current) => [...current, nextPosition]);

    setMessage("💡 یک حرف از کلمه روشن شد و ثابت ماند!");
  };

  /* =========================================================
     SUBMIT WORD
  ========================================================= */

  const submitWord = () => {
    if (!currentWord) return;

    const normalizedCurrentWord = normalizeWord(currentWord);

    const mainWord = level.words.find(
      (word) => normalizeWord(word) === normalizedCurrentWord
    );

    if (mainWord) {
      const alreadyFound = foundWords.some(
        (word) => normalizeWord(word) === normalizedCurrentWord
      );

      if (alreadyFound) {
        setMessage("این کلمه را قبلاً پیدا کردی.");
        setSelectedLetters([]);
        setSelectedLetterIndexes([]);
        setHelpedPositions([]);
        return;
      }

      const nextFoundCount = foundWords.length + 1;

      setFoundWords((current) => [...current, mainWord]);

      setSelectedLetters([]);
      setSelectedLetterIndexes([]);
      setHelpedPositions([]);

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

      return;
    }

    /* =====================================================
       BONUS WORD
    ===================================================== */

    if (isBonusWord(currentLevel, normalizedCurrentWord)) {
      const currentBonusSet =
        bonusRewardedRef.current[currentLevel] ?? new Set<string>();

      if (currentBonusSet.has(normalizedCurrentWord)) {
        setSelectedLetters([]);
        setSelectedLetterIndexes([]);
        setHelpedPositions([]);
        setMessage("این کلمه جایزه را قبلاً پیدا کردی.");
        return;
      }

      currentBonusSet.add(normalizedCurrentWord);
      bonusRewardedRef.current[currentLevel] = currentBonusSet;

      setFoundBonusWordsByLevel((current) => ({
        ...current,
        [currentLevel]: [...(current[currentLevel] ?? []), normalizedCurrentWord],
      }));

      setCoins((current) => current + 1);

      setSelectedLetters([]);
      setSelectedLetterIndexes([]);
      setHelpedPositions([]);

      setMessage("کلمه جایزه پیدا کردی! 🪙 +۱ سکه");

      return;
    }

    setSelectedLetters([]);
    setSelectedLetterIndexes([]);
    setHelpedPositions([]);
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
     TUTORIAL CONTENT
  ========================================================= */

  const tutorialData = [
    {
      icon: "👀",
      title: "اول این قسمت را ببین",
      text: "کلمه‌هایی که باید پیدا کنی اینجا نمایش داده می‌شوند.",
      hint: "اینجا جای کلمات است",
    },
    {
      icon: "👆",
      title: "حالا حروف را انتخاب کن",
      text: "روی حروفی که می‌خواهی به ترتیب کلیک کن تا کلمه ساخته شود.",
      hint: "از اینجا شروع کن",
    },
    {
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
  ][tutorialStep];

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
     UI
  ========================================================= */

  return (
    <main
      dir="rtl"
      className="relative isolate min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#f5f7fb] px-3 py-2 pb-4 text-slate-800 sm:min-h-screen sm:overflow-visible sm:px-6 sm:py-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50" />
      <LetterBackdrop />

      {/* هاله‌های نرم رنگی برای عمق بیشتر */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col sm:min-h-[calc(100vh-4rem)]">
        {/* HEADER */}
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-5">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/games";
            }}
            className="flex items-center gap-1 rounded-2xl bg-white/90 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-800 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <span>→</span>
            منوی اصلی
          </button>

          <button
            type="button"
            onClick={() => setShowLevelMap(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-indigo-600 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <span>🗺️</span>
            مراحل
          </button>

          <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 shadow-sm ring-1 ring-slate-200 sm:gap-2 sm:px-4 sm:py-2.5">
            <span className="text-lg">🪙</span>
            <span className="font-black text-slate-700">{coins}</span>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-2 text-center sm:mb-5">
          <div
            
            
            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg shadow-indigo-200 sm:mb-3 sm:h-16 sm:w-16 sm:rounded-[22px] sm:text-3xl"
          >
            🧩
          </div>

          <p className="text-xs font-bold text-indigo-500">کَلَمَک</p>

          <h1 className="mt-0.5 bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-2xl font-black text-transparent sm:mt-1 sm:text-4xl">
            مرحله {currentLevel}
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
            حروف را به هم وصل کن و کلمات را پیدا کن
          </p>
        </div>

        {/* WORDS */}
        <div
          ref={wordsRef}
          className="mb-2 rounded-[28px] bg-white/90 p-3 shadow-md ring-1 ring-slate-200 sm:mb-5 sm:rounded-[32px] sm:p-6"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {level.words.map((word) => {
              const found = foundWords.some(
                (foundWord) => normalizeWord(foundWord) === normalizeWord(word)
              );

              return (
                <div
                  key={word}
                  
                  className={`flex min-h-[44px] items-center justify-center rounded-2xl border-2 px-2 text-center text-sm font-black transition-all sm:min-h-[58px] sm:px-3 sm:text-base ${
                    found
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : "border-slate-100 bg-slate-50 text-slate-300"
                  }`}
                >
                  {found ? word : word.split("").map(() => "•").join(" ")}
                </div>
              );
            })}
          </div>

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
              
              onClick={submitWord}
              disabled={!currentWord}
              className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:shadow-xl disabled:opacity-30 sm:h-12 sm:px-6 sm:text-base"
            >
              پیدا کن
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
      </div>

      {/* =====================================================
          LEVEL MAP MODAL
      ===================================================== */}

      {showLevelMap && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-3 py-4"
        >
          <div
            
            
            
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-white/70 bg-[#f7faf6] shadow-[0_30px_90px_rgba(15,23,42,0.30)]"
          >
            {/* HEADER */}
            <div className="relative z-20 border-b border-slate-200/70 bg-white/95 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={() => setShowLevelMap(false)}
                className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg font-black text-slate-500 transition-all hover:scale-105 hover:bg-slate-100"
                aria-label="بستن"
              >
                ×
              </button>

              <div className="text-center">
                <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-xl shadow-lg shadow-indigo-100">
                  🗺️
                </div>

                <p className="text-[10px] font-black tracking-wide text-indigo-500">
                  مسیر پیشرفت
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-800 sm:text-2xl">
                  سفر کَلَمَک
                </h2>

                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-600 sm:text-xs">
                    مرحله {maxUnlockedLevel} از {TOTAL_LEVELS}
                  </div>

                  <div className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-500 sm:text-xs">
                    ⭐{" "}
                    {Object.values(levelStars).reduce((sum, value) => sum + value, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* MAP AREA */}
            <div className="relative flex-1 overflow-y-auto px-3 py-5 sm:px-5 sm:py-6">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 top-10 h-36 w-36 rounded-full bg-emerald-100/60 blur-3xl" />
                <div className="absolute -left-20 bottom-10 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute right-[18%] top-[25%] h-16 w-16 rounded-full bg-amber-100/40 blur-2xl" />
                <div className="absolute left-[20%] top-[60%] h-20 w-20 rounded-full bg-purple-100/30 blur-2xl" />

                <div className="absolute right-3 top-3 text-xl opacity-35">🌿</div>
                <div className="absolute left-4 top-[28%] text-xl opacity-30">🍃</div>
                <div className="absolute right-6 bottom-[18%] text-xl opacity-30">🌱</div>
                <div className="absolute left-7 bottom-5 text-xl opacity-25">🍀</div>
              </div>

              {(() => {
                const columns = 6;
                const rows = Math.ceil(mapLevels.length / columns);

                const points = mapLevels.map((_, index) => {
                  const row = Math.floor(index / columns);
                  const position = index % columns;
                  const column = row % 2 === 0 ? position : columns - 1 - position;

                  const x = ((column + 0.5) / columns) * 100;
                  const y = ((row + 0.5) / rows) * 100;

                  return { x, y };
                });

                const pathData = points
                  .map((point, index) => {
                    if (index === 0) {
                      return `M ${point.x} ${point.y}`;
                    }

                    const previous = points[index - 1];
                    const controlX = (previous.x + point.x) / 2;

                    return `Q ${controlX} ${previous.y}, ${point.x} ${point.y}`;
                  })
                  .join(" ");

                return (
                  <div className="relative mx-auto w-full max-w-[610px]">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    >
                      <defs>
                        <linearGradient id="levelPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="45%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>

                      <path
                        d={pathData}
                        fill="none"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d={pathData}
                        fill="none"
                        stroke="url(#levelPathGradient)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="1.5 1"
                      />
                    </svg>

                    <div
                      className="relative z-10 grid"
                      style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gridAutoRows: "76px",
                      }}
                    >
                      {mapLevels.map((levelNumber, index) => {
                        const unlocked = levelNumber <= maxUnlockedLevel;
                        const completed = Boolean(levelStars[levelNumber]);
                        const stars = levelStars[levelNumber] ?? 0;
                        const active = levelNumber === currentLevel;

                        const levelReward = getLevelReward(levelNumber);
                        const bonusCoins =
                          foundBonusWordsByLevel[levelNumber]?.length ?? 0;
                        const totalLevelCoins = levelReward + bonusCoins;

                        return (
                          <div
                            key={levelNumber}
                            
                            
                            
                            className="relative flex items-center justify-center"
                          >
                            <button
                              type="button"
                              disabled={!unlocked}
                              onClick={() => selectLevel(levelNumber)}
                              className={`group relative flex h-[54px] w-[54px] items-center justify-center rounded-full border-[4px] font-black shadow-lg transition-all duration-200 sm:h-[60px] sm:w-[60px] ${
                                active
                                  ? "border-indigo-200 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-indigo-200 ring-4 ring-indigo-100/70"
                                  : completed
                                  ? "border-emerald-100 bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-100"
                                  : unlocked
                                  ? "border-white bg-white text-slate-700 shadow-slate-200 hover:-translate-y-1 hover:scale-105"
                                  : "border-slate-200 bg-slate-100 text-slate-300"
                              }`}
                            >
                              {completed && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-white bg-white px-1.5 py-0.5 text-[8px] leading-none shadow-sm">
                                  {"⭐".repeat(stars)}
                                </span>
                              )}

                              {unlocked ? (
                                <span className="text-lg sm:text-xl">{levelNumber}</span>
                              ) : (
                                <span className="text-lg opacity-80">🔒</span>
                              )}

                              {active && (
                                <span
                                  
                                  
                                  className="absolute -inset-2 -z-10 rounded-full bg-indigo-400"
                                />
                              )}

                              {completed && !active && (
                                <span
                                  className="absolute -bottom-2 -right-2 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-white px-1 text-[9px] font-black text-yellow-500 shadow-md ring-1 ring-yellow-100"
                                  title={`${totalLevelCoins} سکه از این مرحله`}
                                  aria-label={`${totalLevelCoins} سکه از این مرحله`}
                                >
                                  🪙 {totalLevelCoins}
                                </span>
                              )}
                            </button>

                            {active && (
                              <div
                                
                                
                                
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-full bg-indigo-600 px-2 py-1 text-[8px] font-black text-white shadow-md sm:text-[9px]"
                              >
                                اینجایی
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* FOOTER */}
            <div className="relative z-20 border-t border-slate-200/70 bg-white/95 px-4 py-3.5 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-700 sm:text-xs">
                    هر مرحله، یک قدم جلوتر
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium text-slate-400 sm:text-[10px]">
                    ⭐⭐⭐ با پیدا کردن ۵ کلمه جایزه یا بیشتر
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium text-slate-400 sm:text-[10px]">
                    🪙 عدد زیر هر مرحله، جایزه سکه همان مرحله است
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowLevelMap(false);
                    setCurrentLevel(maxUnlockedLevel);
                  }}
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-4 py-2.5 text-[10px] font-black text-white shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:text-xs"
                >
                  ادامه بازی →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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