"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const letters = ["س", "ا", "ر", "ت"];

const targetWords = ["سر", "است", "راس"];

const bonusWords = ["را", "تر", "رس", "تار", "سار", "راست", "سرا"];

export default function Level2() {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [bonusFoundWords, setBonusFoundWords] = useState<string[]>([]);
  const [coins, setCoins] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [message, setMessage] = useState("");

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

    if (targetWords.includes(currentWord)) {
      const updatedWords = [...foundWords, currentWord];

      setFoundWords(updatedWords);
      setSelectedLetters([]);
      setMessage("آفرین! کلمه درست است 🎉");

      if (updatedWords.length === targetWords.length) {
        setTimeout(() => {
          setShowWin(true);
        }, 700);
      }

      return;
    }

    if (bonusWords.includes(currentWord)) {
      setBonusFoundWords((current) => [...current, currentWord]);
      setCoins((current) => current + 1);
      setSelectedLetters([]);
      setMessage("کلمه جایزه پیدا کردی! 🪙 +۱ سکه");
      return;
    }

    setMessage("این کلمه در این مرحله نیست.");
    setSelectedLetters([]);
  };

  const progress =
    (foundWords.length / targetWords.length) * 100;

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 py-6 text-white sm:py-10"
    >
      <div className="mx-auto max-w-4xl">

        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl">🧩</div>

          <p className="text-sm font-semibold text-indigo-300">
            بازی کلمات
          </p>

          <h1 className="mt-1 text-3xl font-black sm:text-5xl">
            مرحله دوم
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            حروف را به هم وصل کن و کلمات را پیدا کن
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl sm:px-6">

          <div>
            <p className="text-xs text-slate-500">
              مرحله
            </p>

            <p className="mt-1 font-black">
              ۲ از ۱۰
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              پیدا شده
            </p>

            <p className="mt-1 font-black text-emerald-300">
              {foundWords.length} / {targetWords.length}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              سکه
            </p>

            <p className="mt-1 font-black text-yellow-300">
              🪙 {coins}
            </p>
          </div>

        </div>

        <div className="relative mb-6 min-h-[400px] overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:min-h-[470px] sm:p-8">

          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center">

            <div className="mb-8 flex min-h-[72px] min-w-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] px-6 shadow-xl">

              {currentWord ? (
                <span className="text-3xl font-black tracking-[0.2em] text-white">
                  {currentWord}
                </span>
              ) : (
                <span className="text-sm text-slate-600">
                  کلمه را بساز
                </span>
              )}

            </div>

            <div className="mb-7 grid w-full max-w-md grid-cols-3 gap-4 sm:gap-6">

              {targetWords.map((word) => {
                const found = foundWords.includes(word);

                return (
                  <motion.div
                    key={word}
                    animate={
                      found
                        ? {
                            scale: [1, 1.08, 1],
                          }
                        : {}
                    }
                    className={`flex min-h-[70px] items-center justify-center rounded-2xl border px-4 text-xl font-black transition-all ${
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

            <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">

              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
              />

            </div>

            <div className="flex min-h-16 items-center justify-center">

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-full px-5 py-3 text-sm font-bold ${
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
        </div>

        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl sm:p-7">

          <div className="mb-6 flex min-h-16 items-center justify-center rounded-2xl border border-white/10 bg-black/10">

            {currentWord ? (
              <span className="text-3xl font-black tracking-widest">
                {currentWord}
              </span>
            ) : (
              <span className="text-sm text-slate-600">
                حروف را انتخاب کن
              </span>
            )}

          </div>

          <div className="mb-6 flex justify-center gap-3 sm:gap-4">

            {letters.map((letter) => {
              const selected = selectedLetters.includes(letter);

              return (
                <motion.button
                  key={letter}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleLetterClick(letter)}
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-4 text-2xl font-black shadow-xl transition-all sm:h-20 sm:w-20 sm:text-3xl ${
                    selected
                      ? "scale-95 border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110 hover:border-indigo-200"
                  }`}
                >
                  {letter}
                </motion.button>
              );
            })}

          </div>

          <div className="flex items-center justify-center gap-3">

            <button
              onClick={removeLastLetter}
              disabled={!selectedLetters.length}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/15 disabled:opacity-30"
            >
              ⌫
            </button>

            <button
              onClick={submitWord}
              disabled={!currentWord}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 font-black shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-30"
            >
              پیدا کن
            </button>

            <button
              onClick={clearWord}
              disabled={!selectedLetters.length}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/15 disabled:opacity-30"
            >
              پاک
            </button>

          </div>

        </div>

        <div className="mt-6 flex items-center justify-center">

          <div className="flex items-center gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 px-5 py-3">

            <span className="text-2xl">
              🏺
            </span>

            <div>
              <p className="text-xs text-slate-500">
                کوزه کلمات جدید
              </p>

              <p className="font-black text-yellow-300">
                {coins} سکه
              </p>
            </div>

          </div>

        </div>

        {bonusFoundWords.length > 0 && (
          <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-4 text-center">

            <p className="mb-3 text-xs text-slate-500">
              کلمات جایزه کشف‌شده
            </p>

            <div className="flex flex-wrap justify-center gap-2">

              {bonusFoundWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300"
                >
                  {word}
                </span>
              ))}

            </div>

          </div>
        )}

      </div>

      {showWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-md">

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-[36px] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 text-center shadow-2xl sm:p-10"
          >

            <div className="text-7xl">
              🎉
            </div>

            <p className="mt-5 text-sm font-bold text-emerald-300">
              مرحله ۲ کامل شد
            </p>

            <h2 className="mt-2 text-4xl font-black">
              تو بردی!
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              همه کلمات اصلی این مرحله را پیدا کردی.
            </p>

            {coins > 0 && (
              <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-yellow-400/10 px-5 py-3 text-yellow-300">
                🪙
                <span className="font-black">
                  {coins} سکه از کلمات جایزه
                </span>
              </div>
            )}

            <button
              onClick={() => setShowWin(false)}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-black shadow-xl transition hover:scale-[1.02] active:scale-95"
            >
              پایان مرحله
            </button>

          </motion.div>

        </div>
      )}

    </main>
  );
}