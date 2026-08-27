"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const games = [
  {
    title: "بازی جدول",
    description: "تمرین حافظه، تمرکز و سرعت پردازش ذهنی",
    icon: "🧩",
    href: "/games/thinking/table",
  },
];

export default function ThinkingPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-6 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-5 text-6xl">🧠</div>

          <h1 className="text-4xl font-black text-white md:text-5xl">
            بازی‌های فکری
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            مجموعه‌ای از بازی‌های طراحی‌شده برای تقویت حافظه، تمرکز و عملکرد ذهنی
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={game.href}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl transition-all duration-500 group-hover:bg-purple-400/30" />

                  <div className="relative">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-5xl shadow-lg">
                      {game.icon}
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                      {game.title}
                    </h2>

                    <p className="mt-3 min-h-[48px] text-sm leading-7 text-slate-300">
                      {game.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between">
                      <span className="text-sm font-semibold text-indigo-300">
                        شروع بازی
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}