"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const SIZE = 4;
const TOTAL = SIZE * SIZE;
const SHOW_TIME = 5;

export default function Level1() {
  const numbers = useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => i + 1),
    []
  );

  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(SHOW_TIME);
  const [selected, setSelected] = useState<number[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!started || !visible) return;

    if (timeLeft === 0) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, visible, timeLeft]);

  const startGame = () => {
    setStarted(true);
    setVisible(true);
    setTimeLeft(SHOW_TIME);
    setSelected([]);
    setNextNumber(1);
    setCompleted(false);
  };

  const handleCellClick = (number: number) => {
    if (!started || visible || completed) return;

    if (number !== nextNumber) return;

    setSelected((current) => [...current, number]);

    if (number === TOTAL) {
      setCompleted(true);
      return;
    }

    setNextNumber((value) => value + 1);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🧩</div>

          <p className="text-sm font-medium text-indigo-300">
            بازی‌های فکری
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            مرحله اول
          </h1>

          <p className="mt-3 text-slate-300">
            اعداد را به خاطر بسپار و بعد به ترتیب پیدا کن
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs text-slate-400">مرحله</p>
            <p className="mt-1 font-bold">۱ از ۱۰</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">عدد بعدی</p>
            <p className="mt-1 text-2xl font-black text-indigo-300">
              {completed ? "✓" : nextNumber}
            </p>
          </div>

          <div className="text-left">
            <p className="text-xs text-slate-400">زمان مشاهده</p>
            <p className="mt-1 font-bold">
              {visible && started ? `${timeLeft} ثانیه` : "شروع"}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          {!started ? (
            <div className="py-12 text-center">
              <div className="text-6xl">🧠</div>

              <h2 className="mt-6 text-2xl font-bold">
                آماده‌ای؟
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-300">
                جدول را چند ثانیه ببین و اعداد را به خاطر بسپار.
                سپس اعداد را از ۱ تا ۱۶ به ترتیب پیدا کن.
              </p>

              <button
                onClick={startGame}
                className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-10 py-4 font-bold shadow-lg transition hover:-translate-y-1 hover:shadow-indigo-500/30"
              >
                شروع مرحله
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {numbers.map((number) => {
                  const isSelected = selected.includes(number);

                  return (
                    <motion.button
                      key={number}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCellClick(number)}
                      className={`aspect-square rounded-2xl text-xl font-black transition-all sm:text-2xl ${
                        visible
                          ? "bg-white text-slate-900 shadow-lg"
                          : isSelected
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-transparent hover:bg-white/20"
                      }`}
                    >
                      {visible || isSelected ? number : "?"}
                    </motion.button>
                  );
                })}
              </div>

              {completed && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl bg-emerald-500/20 p-5 text-center"
                >
                  <div className="text-4xl">🎉</div>

                  <h2 className="mt-3 text-xl font-bold">
                    مرحله با موفقیت انجام شد!
                  </h2>

                  <p className="mt-2 text-sm text-emerald-200">
                    حافظه و تمرکزت عالی بود.
                  </p>

                  <button
                    onClick={startGame}
                    className="mt-5 rounded-xl bg-white px-6 py-3 font-bold text-slate-900"
                  >
                    بازی دوباره
                  </button>
                </motion.div>
              )}

              {!visible && !completed && (
                <p className="mt-5 text-center text-sm text-slate-400">
                  اعداد را از ۱ تا {TOTAL} به ترتیب انتخاب کن
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}