"use client";

import { useState } from "react";
import {
  checkTableWord,
  getTableLevel,
} from "../../data/wordGames";

export default function TablePage() {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [showWin, setShowWin] = useState(false);

  const level = getTableLevel(1);

  if (!level) {
    return <div>Level not found</div>;
  }

  const currentWord = selectedLetters.join("");

  const wordGroups = {
    two: level.words.filter((word) => word.length === 2),
    three: level.words.filter((word) => word.length === 3),
    four: level.words.filter((word) => word.length === 4),
    five: level.words.filter((word) => word.length === 5),
  };

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      return;
    }

    setSelectedLetters((current) => [...current, letter]);
  };

  const handleSubmitWord = () => {
    if (!currentWord) {
      return;
    }

    if (
      checkTableWord(level.id, currentWord) &&
      !foundWords.includes(currentWord)
    ) {
      const newFoundWords = [...foundWords, currentWord];

      setFoundWords(newFoundWords);
      setSelectedLetters([]);

      if (newFoundWords.length === level.words.length) {
        setTimeout(() => {
          setShowWin(true);
        }, 500);
      }

      return;
    }

    setSelectedLetters([]);
  };

  const renderWord = (
    word: string,
    position: string
  ) => {
    const found = foundWords.includes(word);

    return (
      <div
        key={word}
        className={`absolute ${position} flex min-w-[78px] items-center justify-center rounded-2xl border px-4 py-3 text-lg font-black transition-all duration-500 sm:min-w-[92px] sm:px-5 sm:py-3.5 sm:text-xl ${
          found
            ? "scale-105 border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-950/30"
            : "border-white/10 bg-white/[0.06] text-slate-600 backdrop-blur-md"
        }`}
      >
        {found ? (
          word
        ) : (
          <span className="flex gap-1">
            {word.split("").map((_, index) => (
              <span key={index} className="text-slate-600">
                •
              </span>
            ))}
          </span>
        )}
      </div>
    );
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 py-6 text-white sm:px-6 sm:py-10"
    >
      <div className="mx-auto max-w-4xl">

        <div className="mb-5 text-center sm:mb-7">
          <div className="mb-2 text-5xl">🧩</div>

          <p className="text-sm font-semibold text-indigo-300">
            بازی فکری
          </p>

          <h1 className="mt-1 text-3xl font-black sm:text-5xl">
            جدول کلمات
          </h1>

          <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
            <span>مرحله ۱</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span>
              {foundWords.length} / {level.words.length}
            </span>
          </div>
        </div>

        <div className="relative mx-auto mb-6 h-[430px] w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl sm:h-[500px]">

          <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 flex h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-white/5 shadow-2xl backdrop-blur-xl sm:h-[220px] sm:w-[220px]">

            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 text-4xl shadow-lg sm:h-20 sm:w-20 sm:text-5xl">
              🧠
            </div>

            {currentWord ? (
              <div className="flex min-h-10 items-center justify-center px-4">
                <span className="text-2xl font-black tracking-wider text-white sm:text-3xl">
                  {currentWord}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                حروف را انتخاب کنید
              </span>
            )}

            <div className="mt-3 h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
                style={{
                  width: `${(foundWords.length / level.words.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {wordGroups.two[0] &&
            renderWord(
              wordGroups.two[0],
              "right-[7%] top-[16%]"
            )}

          {wordGroups.two[1] &&
            renderWord(
              wordGroups.two[1],
              "left-[7%] top-[20%]"
            )}

          {wordGroups.three[0] &&
            renderWord(
              wordGroups.three[0],
              "right-[4%] bottom-[22%]"
            )}

          {wordGroups.three[1] &&
            renderWord(
              wordGroups.three[1],
              "left-[4%] bottom-[24%]"
            )}

          {wordGroups.four[0] &&
            renderWord(
              wordGroups.four[0],
              "left-[50%] top-[7%] -translate-x-1/2"
            )}

          {wordGroups.four[1] &&
            renderWord(
              wordGroups.four[1],
              "left-[50%] bottom-[7%] -translate-x-1/2"
            )}

          {wordGroups.five[0] &&
            renderWord(
              wordGroups.five[0],
              "right-[27%] top-[8%]"
            )}

          {wordGroups.five[1] &&
            renderWord(
              wordGroups.five[1],
              "left-[27%] bottom-[8%]"
            )}
        </div>

        <div className="mx-auto max-w-2xl rounded-[30px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl sm:p-7">

          <div className="mb-6 flex items-center justify-center gap-3">
            {level.letters.map((letter, index) => {
              const selected = selectedLetters.includes(letter);

              return (
                <button
                  key={`${letter}-${index}`}
                  onClick={() => handleLetterClick(letter)}
                  className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 text-3xl font-black shadow-xl transition-all duration-200 sm:h-20 sm:w-20 ${
                    selected
                      ? "scale-95 border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-950/40"
                      : "border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110 hover:border-indigo-200"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmitWord}
              disabled={!currentWord}
              className="rounded-2xl border border-white/10 bg-white/10 px-9 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ثبت کلمه
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-400">
          <span>
            پیدا شده:
            <strong className="mr-1 text-emerald-300">
              {foundWords.length}
            </strong>
          </span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span>
            باقی‌مانده:
            <strong className="mr-1 text-white">
              {level.words.length - foundWords.length}
            </strong>
          </span>
        </div>
      </div>

      {showWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[36px] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 text-center shadow-2xl sm:p-10">

            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative">

              <div className="mb-5 animate-bounce text-7xl">
                🎉
              </div>

              <div className="mb-3 text-sm font-semibold text-emerald-300">
                مرحله ۱ کامل شد
              </div>

              <h2 className="text-4xl font-black text-white">
                تو بردی!
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                عالی بود! همه کلمات این مرحله را پیدا کردی.
              </p>

              <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-2xl">
                ✓
              </div>

              <button
                onClick={() => {
                  setShowWin(false);
                  setFoundWords([]);
                  setSelectedLetters([]);
                }}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-base font-black text-white shadow-xl shadow-emerald-950/30 transition hover:scale-[1.02] active:scale-95"
              >
                مرحله بعد
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}