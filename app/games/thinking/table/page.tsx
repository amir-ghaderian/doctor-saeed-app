
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getTableLevel,
  isBonusWord,
} from "../../data/wordGames";

const TOTAL_LEVELS = 10;
const COINS_KEY = "word-game-coins";
const BONUS_WORDS_KEY = "word-game-bonus-words";

export default function TablePage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [bonusFoundWords, setBonusFoundWords] = useState<string[]>([]);
  const [coins, setCoins] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const level = getTableLevel(currentLevel);

  useEffect(() => {
    const savedCoins = localStorage.getItem(COINS_KEY);
    const savedBonusWords = localStorage.getItem(BONUS_WORDS_KEY);
    const savedLevel = localStorage.getItem("word-game-level");

    if (savedCoins) {
      setCoins(Number(savedCoins));
    }

    if (savedBonusWords) {
      try {
        setBonusFoundWords(JSON.parse(savedBonusWords));
      } catch {
        setBonusFoundWords([]);
      }
    }

    if (savedLevel) {
      const parsedLevel = Number(savedLevel);

      if (
        Number.isInteger(parsedLevel) &&
        parsedLevel >= 1 &&
        parsedLevel <= TOTAL_LEVELS
      ) {
        setCurrentLevel(parsedLevel);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(COINS_KEY, String(coins));
    localStorage.setItem(
      BONUS_WORDS_KEY,
      JSON.stringify(bonusFoundWords)
    );
    localStorage.setItem(
      "word-game-level",
      String(currentLevel)
    );
  }, [coins, bonusFoundWords, currentLevel, loaded]);

  useEffect(() => {
    setSelectedLetters([]);
    setFoundWords([]);
    setMessage("");
    setShowWin(false);
  }, [currentLevel]);

  if (!loaded || !level) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white"
      >
        <div className="text-center">
          <div className="mb-3 text-5xl">🧩</div>
          <p className="font-bold">در حال آماده‌سازی بازی...</p>
        </div>
      </main>
    );
  }

  const currentWord = selectedLetters.join("");

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      return;
    }

    setSelectedLetters((current) => [...current, letter]);
    setMessage("");
  };

  const removeLastLetter = () => {
    setSelectedLetters((current) => current.slice(0, -1));
    setMessage("");
  };

  const clearWord = () => {
    setSelectedLetters([]);
    setMessage("");
  };

  const submitWord = () => {
    if (!currentWord) {
      return;
    }

    if (foundWords.includes(currentWord)) {
      setMessage("این کلمه را قبلاً پیدا کردی.");
      setSelectedLetters([]);
      return;
    }

    if (bonusFoundWords.includes(currentWord)) {
      setMessage("این کلمه را قبلاً پیدا کردی.");
      setSelectedLetters([]);
      return;
    }

    if (level.words.includes(currentWord)) {
      const updatedWords = [...foundWords, currentWord];

      setFoundWords(updatedWords);
      setSelectedLetters([]);
      setMessage("آفرین! کلمه درست است 🎉");

      if (updatedWords.length === level.words.length) {
        setTimeout(() => {
          setShowWin(true);
        }, 600);
      }

      return;
    }

    if (isBonusWord(currentLevel, currentWord)) {
      const updatedBonusWords = [
        ...bonusFoundWords,
        currentWord,
      ];

      setBonusFoundWords(updatedBonusWords);
      setCoins((current) => current + 1);
      setSelectedLetters([]);
      setMessage("کلمه جایزه پیدا کردی! 🪙 +۱ سکه");
      return;
    }

    setMessage("این کلمه در این مرحله نیست.");
    setSelectedLetters([]);
  };

  const goToNextLevel = () => {
    if (foundWords.length !== level.words.length) {
      return;
    }

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

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-3 py-4 text-white sm:px-5 sm:py-7"
    >
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col justify-center">

        <div className="mb-3 text-center sm:mb-5">
          <div className="text-4xl sm:text-5xl">🧩</div>

          <p className="mt-1 text-xs font-semibold text-indigo-300">
            بازی کلمات
          </p>

          <h1 className="text-2xl font-black sm:text-4xl">
            مرحله {currentLevel}
          </h1>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            حروف را به هم وصل کن و کلمات را پیدا کن
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl sm:mb-5 sm:px-5 sm:py-3">

          <div>
            <p className="text-[10px] text-slate-500">
              مرحله
            </p>

            <p className="font-black">
              {currentLevel} از {TOTAL_LEVELS}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-slate-500">
              پیدا شده
            </p>

            <p className="font-black text-emerald-300">
              {foundWords.length} / {level.words.length}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-slate-500">
              سکه
            </p>

            <p className="font-black text-yellow-300">
              🪙 {coins}
            </p>
          </div>

        </div>

        <div className="mb-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl sm:mb-4 sm:p-6">

          <div className="mb-3 flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 sm:mb-5 sm:min-h-16">

            {currentWord ? (
              <span className="text-2xl font-black tracking-widest sm:text-3xl">
                {currentWord}
              </span>
            ) : (
              <span className="text-xs text-slate-600 sm:text-sm">
                کلمه را بساز
              </span>
            )}

          </div>

          <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-4">

            {level.words.map((word) => {
              const found = foundWords.includes(word);

              return (
                <motion.div
                  key={word}
                  animate={
                    found
                      ? { scale: [1, 1.05, 1] }
                      : {}
                  }
                  className={`flex min-h-12 items-center justify-center rounded-xl border px-2 text-sm font-black sm:min-h-16 sm:rounded-2xl sm:text-xl ${
                    found
                      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 bg-white/[0.04] text-slate-600"
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

          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10 sm:mb-3">

            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
            />

          </div>

          <div className="flex min-h-7 items-center justify-center">

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  message.includes("درست") ||
                  message.includes("جایزه")
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                {message}
              </motion.div>
            )}

          </div>

        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-3 shadow-2xl backdrop-blur-xl sm:p-5">

          <div className="mb-3 flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-black/10 sm:mb-4 sm:min-h-14">

            {currentWord ? (
              <span className="text-2xl font-black tracking-widest">
                {currentWord}
              </span>
            ) : (
              <span className="text-xs text-slate-600">
                حروف را انتخاب کن
              </span>
            )}

          </div>

          <div className="mb-3 flex justify-center gap-2 sm:mb-4 sm:gap-4">

            {level.letters.map((letter) => {
              const selected =
                selectedLetters.includes(letter);

              return (
                <motion.button
                  key={letter}
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleLetterClick(letter)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-4 text-xl font-black shadow-xl transition-all sm:h-18 sm:w-18 sm:text-2xl ${
                    selected
                      ? "scale-95 border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-105"
                  }`}
                >
                  {letter}
                </motion.button>
              );
            })}

          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={removeLastLetter}
              disabled={!selectedLetters.length}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold disabled:opacity-30 sm:rounded-2xl sm:px-5 sm:py-3"
            >
              ⌫
            </button>

            <button
              type="button"
              onClick={submitWord}
              disabled={!currentWord}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-7 py-2.5 font-black shadow-lg disabled:opacity-30 sm:rounded-2xl sm:px-8 sm:py-3"
            >
              پیدا کن
            </button>

            <button
              type="button"
              onClick={clearWord}
              disabled={!selectedLetters.length}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold disabled:opacity-30 sm:rounded-2xl sm:px-5 sm:py-3"
            >
              پاک
            </button>

          </div>

        </div>

        <div className="mt-3 flex justify-center">

          <div className="flex items-center gap-2 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 px-4 py-2">

            <span className="text-xl">🏺</span>

            <div>
              <p className="text-[10px] text-slate-500">
                کوزه کلمات
              </p>

              <p className="text-sm font-black text-yellow-300">
                {coins} سکه
              </p>
            </div>

          </div>

        </div>

        {bonusFoundWords.length > 0 && (
          <div className="mt-2 text-center">

            <p className="text-[10px] text-slate-500">
              کلمات جایزه کشف‌شده
            </p>

            <div className="mt-1 flex flex-wrap justify-center gap-1.5">

              {bonusFoundWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300"
                >
                  {word}
                </span>
              ))}

            </div>

          </div>
        )}

      </div>

      {showWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-sm rounded-[32px] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-7 text-center shadow-2xl"
          >

            <div className="text-6xl">
              🎉
            </div>

            <p className="mt-4 text-sm font-bold text-emerald-300">
              مرحله {currentLevel} کامل شد
            </p>

            <h2 className="mt-1 text-3xl font-black">
              تو بردی!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              همه کلمات اصلی این مرحله را پیدا کردی.
            </p>

            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
              🪙
              <span className="font-black">
                {coins} سکه
              </span>
            </div>

            {currentLevel < TOTAL_LEVELS ? (
              <button
                type="button"
                onClick={goToNextLevel}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 font-black shadow-xl transition hover:scale-[1.02] active:scale-95"
              >
                برو به مرحله {currentLevel + 1}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowWin(false)}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 font-black shadow-xl"
              >
                پایان بازی 🎊
              </button>
            )}

          </motion.div>

        </div>
      )}

    </main>
  );
}