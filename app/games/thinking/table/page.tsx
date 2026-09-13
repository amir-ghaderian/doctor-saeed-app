
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

  const helpProgressRef = useRef({
    level: 1,
    word: "",
    count: 0,
  });

  const bonusRewardedRef = useRef<Record<number, Set<string>>>({});

  const level = getTableLevel(currentLevel);
  const currentWord = normalizeWord(selectedLetters.join(""));

  /* =========================================================
     LOAD GAME
  ========================================================= */

  useEffect(() => {
    const migrationDone = localStorage.getItem(GAME_MIGRATION_KEY);

    if (!migrationDone) {
      localStorage.removeItem(BONUS_WORDS_KEY);
      localStorage.removeItem(STARS_KEY);
      localStorage.removeItem(MAX_LEVEL_KEY);

      localStorage.setItem(LEVEL_KEY, "1");
      localStorage.setItem(GAME_MIGRATION_KEY, "1");
    }

    const savedCoins = localStorage.getItem(COINS_KEY);
    const savedLevel = localStorage.getItem(LEVEL_KEY);
    const savedMaxLevel = localStorage.getItem(MAX_LEVEL_KEY);
    const savedStars = localStorage.getItem(STARS_KEY);
    const savedBonusWords = localStorage.getItem(BONUS_WORDS_KEY);
    const tutorialSeen = localStorage.getItem(TUTORIAL_KEY);

    if (savedCoins) {
      const value = Number(savedCoins);
      if (Number.isFinite(value) && value >= 0) setCoins(value);
    }

    if (savedLevel) {
      const value = Number(savedLevel);
      if (Number.isInteger(value) && value >= 1 && value <= TOTAL_LEVELS) {
        setCurrentLevel(value);
      }
    }

    const savedProgressLevel = Number(savedLevel);
    const savedMaxProgress = Number(savedMaxLevel);

    const restoredMaxLevel =
      Number.isInteger(savedMaxProgress) &&
      savedMaxProgress >= 1 &&
      savedMaxProgress <= TOTAL_LEVELS
        ? savedMaxProgress
        : Number.isInteger(savedProgressLevel) &&
            savedProgressLevel >= 1 &&
            savedProgressLevel <= TOTAL_LEVELS
          ? savedProgressLevel
          : 1;

    setMaxUnlockedLevel(restoredMaxLevel);

    if (savedStars) {
      try {
        const parsed = JSON.parse(savedStars);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const cleaned: Record<number, number> = {};

          Object.entries(parsed).forEach(([key, value]) => {
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
      } catch {
        // داده خراب بود؛ بازی ادامه پیدا می‌کند.
      }
    }

    if (savedBonusWords) {
      try {
        const parsed = JSON.parse(savedBonusWords);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const cleaned: Record<number, string[]> = {};

          Object.entries(parsed).forEach(([key, words]) => {
            const levelNumber = Number(key);

            if (Number.isInteger(levelNumber) && Array.isArray(words)) {
              cleaned[levelNumber] = Array.from(
                new Set(
                  words
                    .filter(
                      (word): word is string => typeof word === "string"
                    )
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
      } catch {
        // داده خراب بود؛ بازی بدون آن ادامه پیدا می‌کند.
      }
    }

    if (tutorialSeen) {
      window.setTimeout(() => {
        setShowLevelMap(true);
      }, 350);
    }

    setLoaded(true);
  }, []);

  /* =========================================================
     SAVE
  ========================================================= */

  useEffect(() => {
    if (loaded) localStorage.setItem(COINS_KEY, String(coins));
  }, [coins, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(LEVEL_KEY, String(currentLevel));
  }, [currentLevel, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(MAX_LEVEL_KEY, String(maxUnlockedLevel));
    }
  }, [maxUnlockedLevel, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STARS_KEY, JSON.stringify(levelStars));
    }
  }, [levelStars, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        BONUS_WORDS_KEY,
        JSON.stringify(foundBonusWordsByLevel)
      );
    }
  }, [foundBonusWordsByLevel, loaded]);

  /* =========================================================
     RESET LEVEL
  ========================================================= */

  useEffect(() => {
    if (!loaded || !level) return;

    setSelectedLetters([]);
    setSelectedLetterIndexes([]);
    setFoundWords([]);
    setMessage("");
    setShowWin(false);

    setDisplayLetters(
      level.letters.map((letter, originalIndex) => ({
        letter,
        originalIndex,
      }))
    );

    helpProgressRef.current = {
      level: currentLevel,
      word: "",
      count: 0,
    };
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
        className="flex min-h-screen items-center justify-center bg-[#f5f7fb]"
      >
        <div className="text-center">
          <div className="mb-3 text-5xl">🧩</div>
          <p className="font-bold text-slate-700">
            در حال آماده‌سازی بازی...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     GAME ACTIONS
  ========================================================= */

  const handleLetterClick = (
    letter: string,
    originalIndex: number
  ) => {
    if (selectedLetterIndexes.includes(originalIndex)) return;

    setSelectedLetterIndexes((current) => [
      ...current,
      originalIndex,
    ]);

    setSelectedLetters((current) => [
      ...current,
      letter,
    ]);

    setMessage("");
  };

  const clearWord = () => {
    setSelectedLetters([]);
    setSelectedLetterIndexes([]);
    setMessage("");

    helpProgressRef.current = {
      level: currentLevel,
      word: "",
      count: 0,
    };
  };

  const removeLastLetter = () => {
    setSelectedLetters((current) => current.slice(0, -1));
    setSelectedLetterIndexes((current) => current.slice(0, -1));
    setMessage("");

    helpProgressRef.current = {
      level: currentLevel,
      word: "",
      count: 0,
    };
  };

  const shuffleLetters = () => {
    if (displayLetters.length < 2) return;

    const shuffled = [...displayLetters];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [
        shuffled[j],
        shuffled[i],
      ];
    }

    const sameOrder = shuffled.every(
      (item, index) =>
        item.originalIndex === displayLetters[index].originalIndex
    );

    if (sameOrder) {
      [shuffled[0], shuffled[1]] = [
        shuffled[1],
        shuffled[0],
      ];
    }

    setDisplayLetters(shuffled);
    setMessage("");
  };

  /* =========================================================
     HELP
  ========================================================= */

  const useHelp = () => {
    if (coins < 5) {
      setMessage(
        "برای استفاده از کمک حداقل ۵ سکه لازم داری 🪙"
      );
      return;
    }

    const remainingWords = level.words.filter(
      (word) =>
        !foundWords.some(
          (foundWord) =>
            normalizeWord(foundWord) === normalizeWord(word)
        )
    );

    if (!remainingWords.length) {
      setMessage("همه کلمات این مرحله را پیدا کردی 🎉");
      return;
    }

    const targetWord = normalizeWord(remainingWords[0]);
    const currentSelection = normalizeWord(selectedLetters.join(""));

    /*
     * اگر کلمه‌ای در حال ساخته شدن است، باید حتماً
     * ابتدای یکی از کلمات هدف باشد.
     *
     * در غیر این صورت کمک نباید از جای دیگری از کلمه
     * یک حرف به کاربر بدهد.
     */
    if (
      currentSelection &&
      !targetWord.startsWith(currentSelection)
    ) {
      setMessage(
        "اول کلمه فعلی را کامل یا پاک کن، سپس از کمک استفاده کن."
      );
      return;
    }

    /*
     * تعداد حروف فعلی مشخص می‌کند کمک بعدی باید
     * کدام حرف کلمه هدف را نشان دهد.
     *
     * این روش دیگر به شمارنده قدیمی وابسته نیست و
     * بعد از پاک کردن کلمه هم از ابتدا شروع می‌شود.
     */
    const nextPosition = currentSelection.length;

    if (nextPosition >= targetWord.length) {
      setMessage(
        "کلمه فعلی کامل است؛ آن را پیدا کن یا پاک کن."
      );
      return;
    }

    const targetLetter = targetWord[nextPosition];
    const usedIndexes = new Set(selectedLetterIndexes);

    const helpIndex = level.letters.findIndex(
      (letter, index) =>
        normalizeWord(letter) === normalizeWord(targetLetter) &&
        !usedIndexes.has(index)
    );

    if (helpIndex === -1) {
      setMessage(
        "حرف لازم برای این کمک در حروف باقی‌مانده نیست؛ کلمه فعلی را پاک کن."
      );
      return;
    }

    const helpLetter = level.letters[helpIndex];

    helpProgressRef.current = {
      level: currentLevel,
      word: targetWord,
      count: nextPosition + 1,
    };

    setCoins((current) => current - 5);

    setSelectedLetterIndexes((current) =>
      current.includes(helpIndex)
        ? current
        : [...current, helpIndex]
    );

    setSelectedLetters((current) => [
      ...current,
      helpLetter,
    ]);

    setMessage("💡 یک حرف از کلمه روشن شد!");
  };

  /* =========================================================
     SUBMIT WORD
  ========================================================= */

  const submitWord = () => {
    if (!currentWord) return;

    const normalizedCurrentWord = normalizeWord(currentWord);

    const mainWord = level.words.find(
      (word) =>
        normalizeWord(word) === normalizedCurrentWord
    );

    if (mainWord) {
      const alreadyFound = foundWords.some(
        (word) =>
          normalizeWord(word) === normalizedCurrentWord
      );

      if (alreadyFound) {
        setMessage("این کلمه را قبلاً پیدا کردی.");
        setSelectedLetters([]);
        setSelectedLetterIndexes([]);

        helpProgressRef.current = {
          level: currentLevel,
          word: "",
          count: 0,
        };

        return;
      }

      const nextFoundCount = foundWords.length + 1;

      setFoundWords((current) => [
        ...current,
        mainWord,
      ]);

      setSelectedLetters([]);
      setSelectedLetterIndexes([]);

      helpProgressRef.current = {
        level: currentLevel,
        word: "",
        count: 0,
      };

      setMessage("آفرین! کلمه درست است 🎉");

      if (nextFoundCount === level.words.length) {
        window.setTimeout(() => {
          const bonusCount =
            bonusRewardedRef.current[currentLevel]?.size ?? 0;

          const stars =
            bonusCount >= 5
              ? 3
              : bonusCount >= 1
                ? 2
                : 1;

          setLevelStars((current) => ({
            ...current,
            [currentLevel]: Math.max(
              current[currentLevel] ?? 0,
              stars
            ),
          }));

          if (currentLevel < TOTAL_LEVELS) {
            setMaxUnlockedLevel((current) =>
              Math.max(current, currentLevel + 1)
            );
          }

          setShowWin(true);
        }, 600);
      }

      return;
    }

    /* =====================================================
       BONUS WORD
    ===================================================== */

    if (
      isBonusWord(
        currentLevel,
        normalizedCurrentWord
      )
    ) {
      const currentBonusSet =
        bonusRewardedRef.current[currentLevel] ??
        new Set<string>();

      if (currentBonusSet.has(normalizedCurrentWord)) {
        setSelectedLetters([]);
        setSelectedLetterIndexes([]);

        helpProgressRef.current = {
          level: currentLevel,
          word: "",
          count: 0,
        };

        setMessage(
          "این کلمه جایزه را قبلاً پیدا کردی."
        );

        return;
      }

      currentBonusSet.add(normalizedCurrentWord);

      bonusRewardedRef.current[currentLevel] =
        currentBonusSet;

      setFoundBonusWordsByLevel((current) => ({
        ...current,
        [currentLevel]: [
          ...(current[currentLevel] ?? []),
          normalizedCurrentWord,
        ],
      }));

      setCoins((current) => current + 1);

      setSelectedLetters([]);
      setSelectedLetterIndexes([]);

      helpProgressRef.current = {
        level: currentLevel,
        word: "",
        count: 0,
      };

      setMessage(
        "کلمه جایزه پیدا کردی! 🪙 +۱ سکه"
      );

      return;
    }

    setSelectedLetters([]);
    setSelectedLetterIndexes([]);

    helpProgressRef.current = {
      level: currentLevel,
      word: "",
      count: 0,
    };
  };

  /* =========================================================
     LEVEL NAVIGATION
  ========================================================= */

  const selectLevel = (levelNumber: number) => {
    if (
      levelNumber < 1 ||
      levelNumber > maxUnlockedLevel ||
      levelNumber > TOTAL_LEVELS
    ) {
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

  const progress =
    level.words.length > 0
      ? (foundWords.length / level.words.length) * 100
      : 0;

  const currentBonusCount =
    foundBonusWordsByLevel[currentLevel]?.length ?? 0;

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

  const mapLevels = Array.from(
    { length: TOTAL_LEVELS },
    (_, index) => index + 1
  );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#f5f7fb] px-4 py-5 text-slate-800 sm:px-6 sm:py-8"
      style={{
        backgroundImage: 'url("/pic/bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundColor: "rgba(241,245,249,0.75)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-xl flex-col">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/games";
            }}
            className="flex items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-800"
          >
            <span>→</span>
            منوی اصلی
          </button>

          <button
            type="button"
            onClick={() => setShowLevelMap(true)}
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-indigo-600 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span>🗺️</span>
            مراحل
          </button>

          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="text-lg">🪙</span>
            <span className="font-black text-slate-700">
              {coins}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl shadow-lg shadow-indigo-200">
            🧩
          </div>

          <p className="text-xs font-bold text-indigo-500">
            کَلَمَک
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-800 sm:text-4xl">
            مرحله {currentLevel}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            حروف را به هم وصل کن و کلمات را پیدا کن
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-5 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400">
                پیشرفت مرحله
              </p>

              <p className="mt-1 text-sm font-black text-slate-700">
                {foundWords.length} از {level.words.length} کلمه
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentStars > 0 && (
                <div className="rounded-2xl bg-yellow-50 px-3 py-2 text-sm">
                  {"⭐".repeat(currentStars)}
                </div>
              )}

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>

        {/* WORDS */}
        <div
          ref={wordsRef}
          className="mb-5 rounded-[32px] bg-white p-4 shadow-md ring-1 ring-slate-200 sm:p-6"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {level.words.map((word) => {
              const found = foundWords.some(
                (foundWord) =>
                  normalizeWord(foundWord) === normalizeWord(word)
              );

              return (
                <motion.div
                  key={word}
                  animate={
                    found
                      ? { scale: [1, 1.05, 1] }
                      : {}
                  }
                  className={`flex min-h-[58px] items-center justify-center rounded-2xl border-2 px-3 text-center font-black transition-all ${
                    found
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : "border-slate-100 bg-slate-50 text-slate-300"
                  }`}
                >
                  {found
                    ? word
                    : word
                        .split("")
                        .map(() => "•")
                        .join(" ")}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50 px-4">
            {currentWord ? (
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-black tracking-[0.25em] text-indigo-600"
              >
                {currentWord}
              </motion.span>
            ) : (
              <span className="text-sm font-bold text-slate-400">
                کلمه را بساز
              </span>
            )}
          </div>

          <div className="mt-3 flex min-h-8 items-center justify-center">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  message.includes("درست") ||
                  message.includes("جایزه") ||
                  message.includes("روشن")
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>
        </div>

        {/* LETTERS */}
        <div
          ref={lettersRef}
          className="rounded-[36px] bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-7"
        >
          <div className="mb-6 text-center">
            <p className="text-xs font-bold text-slate-400">
              حروف مرحله
            </p>
          </div>

          <div className="mb-7 flex flex-wrap justify-center gap-3 sm:gap-4">
            {displayLetters.map(
              ({ letter, originalIndex }) => {
                const selected =
                  selectedLetterIndexes.includes(originalIndex);

                return (
                  <motion.button
                    key={`${letter}-${originalIndex}`}
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ y: -3 }}
                    onClick={() =>
                      handleLetterClick(
                        letter,
                        originalIndex
                      )
                    }
                    className={`flex h-[62px] w-[62px] items-center justify-center rounded-full border-[5px] text-2xl font-black text-white shadow-md transition-all sm:h-[72px] sm:w-[72px] sm:text-3xl ${
                      selected
                        ? "border-emerald-300 bg-gradient-to-br from-emerald-400 to-teal-500"
                        : "border-indigo-100 bg-gradient-to-br from-indigo-500 to-purple-500"
                    }`}
                  >
                    {letter}
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={removeLastLetter}
              disabled={!selectedLetters.length}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
              aria-label="حذف آخرین حرف"
              title="حذف آخرین حرف"
            >
              ⌫
            </motion.button>

            <motion.button
              ref={findButtonRef}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={submitWord}
              disabled={!currentWord}
              className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 font-black text-white shadow-lg shadow-indigo-100 transition hover:shadow-xl disabled:opacity-30"
            >
              پیدا کن
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={clearWord}
              disabled={!selectedLetters.length}
              className="h-12 w-12 rounded-2xl bg-slate-100 text-xs font-black text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
              aria-label="پاک کردن کلمه"
              title="پاک کردن کلمه"
            >
              پاک
            </motion.button>
          </div>

          <div className="mt-4 flex items-end justify-evenly">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={shuffleLetters}
              disabled={displayLetters.length < 2}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 font-black text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="جابجایی حروف"
              title="جابجایی حروف"
            >
              <span className="text-lg">🔀</span>
              <span>جابجایی</span>
            </motion.button>

            <div className="mt-4 flex justify-center">
              <div
                ref={coinJarRef}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-xl">
                  🏺
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400">
                    کوزه امتیاز
                  </p>

                  <p className="text-sm font-black text-yellow-500">
                    {coins} سکه
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={useHelp}
              disabled={
                coins < 5 ||
                foundWords.length === level.words.length
              }
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 font-black text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-lg">💡</span>
              <span>کمک</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                ۵ 🪙
              </span>
            </motion.button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 pb-4 text-center">
          <p className="text-[10px] font-bold text-slate-400">
            مرحله {currentLevel} از {TOTAL_LEVELS}
          </p>
        </div>
      </div>

      {/* =====================================================
          LEVEL MAP MODAL
      ===================================================== */}

      {showLevelMap && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-3 py-4 backdrop-blur-[4px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              flex
              max-h-[88vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-[32px]
              border
              border-white/70
              bg-[#f7faf6]
              shadow-[0_30px_90px_rgba(15,23,42,0.30)]
            "
          >
            <div className="relative z-20 border-b border-slate-200/70 bg-white/95 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={() => setShowLevelMap(false)}
                className="
                  absolute
                  left-4
                  top-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-slate-50
                  text-lg
                  font-black
                  text-slate-500
                  transition-all
                  hover:scale-105
                  hover:bg-slate-100
                "
                aria-label="بستن"
              >
                ×
              </button>

              <div className="text-center">
                <div
                  className="
                    mx-auto
                    mb-2.5
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-[16px]
                    bg-gradient-to-br
                    from-indigo-500
                    via-violet-500
                    to-purple-600
                    text-xl
                    shadow-lg
                    shadow-indigo-100
                  "
                >
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
                    {Object.values(levelStars).reduce(
                      (sum, value) => sum + value,
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-3 py-5 sm:px-5 sm:py-6">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 top-10 h-36 w-36 rounded-full bg-emerald-100/60 blur-3xl" />
                <div className="absolute -left-20 bottom-10 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute right-[18%] top-[25%] h-16 w-16 rounded-full bg-amber-100/40 blur-2xl" />
                <div className="absolute left-[20%] top-[60%] h-20 w-20 rounded-full bg-purple-100/30 blur-2xl" />

                <div className="absolute right-3 top-3 text-xl opacity-35">
                  🌿
                </div>

                <div className="absolute left-4 top-[28%] text-xl opacity-30">
                  🍃
                </div>

                <div className="absolute right-6 bottom-[18%] text-xl opacity-30">
                  🌱
                </div>

                <div className="absolute left-7 bottom-5 text-xl opacity-25">
                  🍀
                </div>
              </div>

              {(() => {
                const columns = 6;
                const rows = Math.ceil(mapLevels.length / columns);

                const points = mapLevels.map((_, index) => {
                  const row = Math.floor(index / columns);
                  const position = index % columns;

                  const column =
                    row % 2 === 0
                      ? position
                      : columns - 1 - position;

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

                    const controlX =
                      (previous.x + point.x) / 2;
                    const controlY =
                      (previous.y + point.y) / 2;

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
                        <linearGradient
                          id="levelPathGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#818cf8"
                          />
                          <stop
                            offset="45%"
                            stopColor="#a78bfa"
                          />
                          <stop
                            offset="100%"
                            stopColor="#34d399"
                          />
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
                        const unlocked =
                          levelNumber <= maxUnlockedLevel;
                        const completed =
                          Boolean(levelStars[levelNumber]);
                        const stars =
                          levelStars[levelNumber] ?? 0;
                        const active =
                          levelNumber === currentLevel;

                        return (
                          <motion.div
                            key={levelNumber}
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: Math.min(
                                index * 0.025,
                                0.4
                              ),
                              duration: 0.35,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <button
                              type="button"
                              disabled={!unlocked}
                              onClick={() =>
                                selectLevel(levelNumber)
                              }
                              className={`
                                group
                                relative
                                flex
                                h-[54px]
                                w-[54px]
                                items-center
                                justify-center
                                rounded-full
                                border-[4px]
                                font-black
                                shadow-lg
                                transition-all
                                duration-200
                                sm:h-[60px]
                                sm:w-[60px]

                                ${
                                  active
                                    ? `
                                      border-indigo-200
                                      bg-gradient-to-br
                                      from-indigo-500
                                      via-violet-500
                                      to-purple-600
                                      text-white
                                      shadow-indigo-200
                                      ring-4
                                      ring-indigo-100/70
                                    `
                                    : completed
                                      ? `
                                        border-emerald-100
                                        bg-gradient-to-br
                                        from-emerald-400
                                        to-teal-500
                                        text-white
                                        shadow-emerald-100
                                      `
                                      : unlocked
                                        ? `
                                          border-white
                                          bg-white
                                          text-slate-700
                                          shadow-slate-200
                                          hover:-translate-y-1
                                          hover:scale-105
                                        `
                                        : `
                                          border-slate-200
                                          bg-slate-100
                                          text-slate-300
                                        `
                                }
                              `}
                            >
                              {completed && (
                                <span
                                  className="
                                    absolute
                                    -top-2
                                    left-1/2
                                    -translate-x-1/2
                                    rounded-full
                                    border
                                    border-white
                                    bg-white
                                    px-1.5
                                    py-0.5
                                    text-[8px]
                                    leading-none
                                    shadow-sm
                                  "
                                >
                                  {"⭐".repeat(stars)}
                                </span>
                              )}

                              {unlocked ? (
                                <span className="text-lg sm:text-xl">
                                  {levelNumber}
                                </span>
                              ) : (
                                <span className="text-lg opacity-80">
                                  🔒
                                </span>
                              )}

                              {active && (
                                <motion.span
                                  animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [
                                      0.35,
                                      0.1,
                                      0.35,
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                  className="
                                    absolute
                                    -inset-2
                                    -z-10
                                    rounded-full
                                    bg-indigo-400
                                  "
                                />
                              )}

                              {completed && !active && (
                                <span
                                  className="
                                    absolute
                                    -bottom-1
                                    -right-1
                                    flex
                                    h-4
                                    w-4
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    text-[8px]
                                    shadow-sm
                                    ring-1
                                    ring-emerald-100
                                  "
                                >
                                  ✓
                                </span>
                              )}
                            </button>

                            {active && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  y: 4,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}
                                transition={{
                                  duration: 0.25,
                                }}
                                className="
                                  absolute
                                  -bottom-1
                                  left-1/2
                                  -translate-x-1/2
                                  translate-y-full
                                  whitespace-nowrap
                                  rounded-full
                                  bg-indigo-600
                                  px-2
                                  py-1
                                  text-[8px]
                                  font-black
                                  text-white
                                  shadow-md
                                  sm:text-[9px]
                                "
                              >
                                اینجایی
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="relative z-20 border-t border-slate-200/70 bg-white/95 px-4 py-3.5 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-700 sm:text-xs">
                    هر مرحله، یک قدم جلوتر
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium text-slate-400 sm:text-[10px]">
                    ⭐⭐⭐ با پیدا کردن ۵ کلمه جایزه یا بیشتر
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowLevelMap(false);
                    setCurrentLevel(maxUnlockedLevel);
                  }}
                  className="
                    shrink-0
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    via-violet-500
                    to-purple-600
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-white
                    shadow-lg
                    shadow-indigo-100
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    sm:px-5
                    sm:text-xs
                  "
                >
                  ادامه بازی →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* =====================================================
          TUTORIAL
      ===================================================== */}

      {showTutorial && tutorialTarget && (
        <div
          dir="rtl"
          className="pointer-events-none fixed inset-0 z-[100]"
        >
          <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]" />

          <button
            type="button"
            onClick={skipTutorial}
            className="pointer-events-auto fixed right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-600 shadow-xl"
          >
            رد کردن
          </button>

          <motion.div
            key={`target-${tutorialStep}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute rounded-[28px] border-4 border-indigo-400 bg-indigo-400/10 shadow-[0_0_0_5px_rgba(99,102,241,0.18),0_0_35px_rgba(99,102,241,0.35)]"
            style={{
              top: tutorialTarget.top - 7,
              left: tutorialTarget.left - 7,
              width: tutorialTarget.width + 14,
              height: tutorialTarget.height + 14,
            }}
          />

          <motion.div
            key={`arrow-${tutorialStep}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: [0, 7, 0],
            }}
            transition={{
              opacity: { duration: 0.25 },
              y: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute z-[102] -translate-x-1/2 text-5xl font-black leading-none text-indigo-600 drop-shadow-lg"
            style={{
              top: arrowTop,
              left: arrowLeft,
            }}
          >
            ↓
          </motion.div>

          <motion.div
            ref={tutorialCardRef}
            key={`card-${tutorialStep}`}
            initial={{
              opacity: 0,
              y: 15,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="absolute z-[103] w-[calc(100vw-28px)] max-w-[390px] rounded-[30px] border border-white/80 bg-white p-5 text-center shadow-[0_20px_70px_rgba(15,23,42,0.25)]"
            style={{
              top: tutorialCard?.top ?? 20,
              left:
                tutorialCard?.left ??
                Math.max(14, (window.innerWidth - 390) / 2),
            }}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl shadow-sm">
              <motion.span
                animate={{
                  scale: [1, 1.12, 1],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              >
                {tutorialData.icon}
              </motion.span>
            </div>

            <div className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-600">
              مرحله {tutorialStep + 1} از ۴
            </div>

            <h3 className="mt-2 text-xl font-black text-slate-800">
              {tutorialData.title}
            </h3>

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
                    step === tutorialStep
                      ? "w-7 bg-indigo-500"
                      : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* =====================================================
          WIN MODAL
      ===================================================== */}

      {showWin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 px-5"
          style={{
            backgroundColor: "rgba(15,23,42,0.50)",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-sm rounded-[36px] bg-white p-7 text-center shadow-2xl"
          >
            <motion.div
              animate={{
                rotate: [0, -8, 8, -5, 5, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 0.8 }}
              className="text-7xl"
            >
              🎉
            </motion.div>

            <p className="mt-5 text-sm font-bold text-emerald-500">
              مرحله {currentLevel} کامل شد
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-800">
              عالی بود!
            </h2>

            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400">
                امتیاز این مرحله
              </p>

              <div className="mt-2 text-3xl tracking-[0.2em]">
                {"⭐".repeat(currentStars)}
                <span className="opacity-20">
                  {"⭐".repeat(3 - currentStars)}
                </span>
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
              🪙
              {coins} سکه
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
          </motion.div>
        </div>
      )}
    </main>
  );
}
