"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TableGamePage() {
  const totalLevels = 8;
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("doctor-table-progress");

    if (saved) {
      const data = JSON.parse(saved);
      setCurrentLevel(data.currentLevel || 1);
    }
  }, []);

  const progress = (currentLevel / totalLevels) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6">

      {/* عنوان */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-cyan-700">
          🧩 بازی جدول
        </h1>

        <p className="text-gray-600 mt-2">
          هشت مرحله برای تقویت حافظه و تمرکز
        </p>
      </motion.div>

      {/* نوار پیشرفت */}
      <div className="max-w-xl mx-auto mb-10">

        <div className="flex justify-between mb-2 text-sm">

          <span>پیشرفت</span>

          <span>{Math.round(progress)}%</span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-4 rounded-full bg-gradient-to-r from-green-500 to-cyan-500"
          />

        </div>

      </div>

      {/* مراحل */}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {Array.from({ length: totalLevels }).map((_, index) => {
          const level = index + 1;

          const unlocked = level <= currentLevel;

          return (
            <motion.div
              key={level}
              whileHover={{
                scale: unlocked ? 1.05 : 1,
              }}
            >
              <div
                className={`rounded-2xl shadow-lg p-6 h-56 flex flex-col justify-between ${
                  unlocked
                    ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                <div className="text-5xl text-center">
                  {unlocked ? "🟢" : "🔒"}
                </div>

                <div className="text-center">

                  <h2 className="text-2xl font-bold">

                    مرحله {level}

                  </h2>

                </div>

                {unlocked ? (
                  <Link href={`/games/table/level/${level}`}>
                    <button className="w-full rounded-xl bg-white text-cyan-700 py-2 font-bold hover:bg-cyan-100 transition">
                      شروع
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-gray-500 text-white py-2 cursor-not-allowed"
                  >
                    قفل است
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}