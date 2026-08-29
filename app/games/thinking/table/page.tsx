"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTableLevel, isBonusWord } from "../../data/wordGames";

const TOTAL_LEVELS = 10;
const COINS_KEY = "word-game-coins";
const BONUS_WORDS_KEY = "word-game-bonus-words";
const LEVEL_KEY = "word-game-level";

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
const currentWord = selectedLetters.join("");

useEffect(() => {
const savedCoins = localStorage.getItem(COINS_KEY);
const savedLevel = localStorage.getItem(LEVEL_KEY);


if (savedCoins) {
  const parsedCoins = Number(savedCoins);

  if (Number.isFinite(parsedCoins)) {
    setCoins(parsedCoins);
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
if (!loaded) {
return;
}


const savedBonusWords = localStorage.getItem(
  `${BONUS_WORDS_KEY}-${currentLevel}`
);

if (savedBonusWords) {
  try {
    const parsedWords = JSON.parse(savedBonusWords);

    if (Array.isArray(parsedWords)) {
      setBonusFoundWords(parsedWords);
    } else {
      setBonusFoundWords([]);
    }
  } catch {
    setBonusFoundWords([]);
  }
} else {
  setBonusFoundWords([]);
}

localStorage.setItem(COINS_KEY, String(coins));
localStorage.setItem(LEVEL_KEY, String(currentLevel));


}, [currentLevel, loaded, coins]);

useEffect(() => {
if (!loaded) {
return;
}


localStorage.setItem(
  `${BONUS_WORDS_KEY}-${currentLevel}`,
  JSON.stringify(bonusFoundWords)
);


}, [bonusFoundWords, currentLevel, loaded]);

useEffect(() => {
setSelectedLetters([]);
setFoundWords([]);
setMessage("");
setShowWin(false);
}, [currentLevel]);

if (!loaded || !level) {
return ( <main
     dir="rtl"
     className="flex min-h-screen items-center justify-center bg-[#f5f7fb]"
   > <div className="text-center"> <div className="mb-3 text-5xl">🧩</div> <p className="font-bold text-slate-700">
در حال آماده‌سازی بازی... </p> </div> </main>
);
}

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


if (
  foundWords.includes(currentWord) ||
  bonusFoundWords.includes(currentWord)
) {
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

return ( <main
   dir="rtl"
   className="min-h-screen overflow-hidden bg-[#f5f7fb] px-4 py-5 text-slate-800 sm:px-6 sm:py-8"
 > <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-xl flex-col">

```
    <div className="mb-5 flex items-center justify-between">
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

      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
        <span className="text-lg">🪙</span>
        <span className="font-black text-slate-700">
          {coins}
        </span>
      </div>
    </div>

    <div className="mb-5 text-center">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl shadow-lg shadow-indigo-200">
        🧩
      </div>

      <p className="text-xs font-bold text-indigo-500">
        بازی کلمات
      </p>

      <h1 className="mt-1 text-3xl font-black text-slate-800 sm:text-4xl">
        مرحله {currentLevel}
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        حروف را به هم وصل کن و کلمات را پیدا کن
      </p>
    </div>

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

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-600">
          {Math.round(progress)}%
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

    <div className="mb-5 rounded-[32px] bg-white p-4 shadow-md ring-1 ring-slate-200 sm:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {level.words.map((word) => {
          const found = foundWords.includes(word);

          return (
            <motion.div
              key={word}
              animate={
                found
                  ? {
                      scale: [1, 1.05, 1],
                    }
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

      <div className="mt-5 flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50/50 px-4">
        {currentWord ? (
          <motion.span
            key={currentWord}
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="text-2xl font-black tracking-[0.25em] text-indigo-600"
          >
            {currentWord}
          </motion.span>
        ) : (
          <span className="text-sm font-bold text-slate-300">
            کلمه را بساز
          </span>
        )}
      </div>

      <div className="mt-3 flex min-h-8 items-center justify-center">
        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              message.includes("درست") ||
              message.includes("جایزه")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>

    <div className="rounded-[36px] bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-7">
      <div className="mb-6 text-center">
        <p className="text-xs font-bold text-slate-400">
          حروف مرحله
        </p>
      </div>

      <div className="mb-7 flex flex-wrap justify-center gap-3 sm:gap-4">
        {level.letters.map((letter, index) => {
          const selected = selectedLetters.includes(letter);

          return (
            <motion.button
              key={`${letter}-${index}`}
              type="button"
              whileTap={{ scale: 0.88 }}
              whileHover={{ y: -3 }}
              onClick={() => handleLetterClick(letter)}
              className={`flex h-[62px] w-[62px] items-center justify-center rounded-full border-[5px] text-2xl font-black shadow-md transition-all sm:h-[72px] sm:w-[72px] sm:text-3xl ${
                selected
                  ? "border-emerald-300 bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-100"
                  : "border-indigo-100 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-100"
              }`}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={removeLastLetter}
          disabled={!selectedLetters.length}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
        >
          ⌫
        </motion.button>

        <motion.button
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
        >
          پاک
        </motion.button>
      </div>
    </div>

    <div className="mt-5 flex justify-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-xl">
          🏺
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400">
            کوزه کلمات
          </p>

          <p className="text-sm font-black text-yellow-500">
            {coins} سکه
          </p>
        </div>
      </div>
    </div>

    {bonusFoundWords.length > 0 && (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-4 rounded-2xl bg-yellow-50 p-4 text-center ring-1 ring-yellow-100"
      >
        <p className="text-[11px] font-bold text-yellow-600">
          کلمات جایزه کشف‌شده
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {bonusFoundWords.map((word) => (
            <span
              key={word}
              className="rounded-full bg-white px-3 py-1 text-xs font-black text-yellow-600 shadow-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </motion.div>
    )}

    <div className="mt-6 pb-4 text-center">
      <p className="text-[10px] font-bold text-slate-300">
        مرحله {currentLevel} از {TOTAL_LEVELS}
      </p>
    </div>
  </div>

  {showWin && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-5 backdrop-blur-sm">
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
          transition={{
            duration: 0.8,
          }}
          className="text-7xl"
        >
          🎉
        </motion.div>

        <p className="mt-5 text-sm font-bold text-emerald-500">
          مرحله {currentLevel} کامل شد
        </p>

        <h2 className="mt-1 text-3xl font-black text-slate-800">
          تو بردی!
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          همه کلمات این مرحله را پیدا کردی.
          <br />
          آماده‌ای برای مرحله بعد؟
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
      </motion.div>
    </div>
  )}
</main>


);
}
