"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ThinkingTablePage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-6 py-12"
    >
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 text-6xl shadow-xl"
            >
              🧩
            </motion.div>

            <h1 className="mt-8 text-4xl font-black text-white md:text-5xl">
              بازی جدول
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              یک بازی برای تقویت حافظه، تمرکز و سرعت پردازش ذهنی
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-white/10 px-5 py-2 text-sm text-slate-200">
                🧠 حافظه
              </span>

              <span className="rounded-full bg-white/10 px-5 py-2 text-sm text-slate-200">
                🎯 تمرکز
              </span>

              <span className="rounded-full bg-white/10 px-5 py-2 text-sm text-slate-200">
                ⚡ سرعت
              </span>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/games/table"
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/30"
              >
                شروع بازی
              </Link>

              <Link
                href="/games/thinking"
                className="rounded-2xl border border-white/10 bg-white/10 px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-white/15"
              >
                بازگشت
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}