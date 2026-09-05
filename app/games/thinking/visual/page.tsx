
"use client";

import { motion } from "framer-motion";

export default function VisualPage() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-5 py-8"
      style={{
        backgroundImage: 'url("/pic/bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundColor: "rgba(241,245,249,0.78)",
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] bg-indigo-500 text-5xl shadow-xl shadow-indigo-200"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          }}
        >
          🖼️
        </motion.div>

        {/* Small title */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-sm font-black text-indigo-500"
        >
          بازی تصویرک
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-2 text-4xl font-black text-slate-800"
        >
          به‌زودی...
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mx-auto mt-4 max-w-sm text-sm font-bold leading-7 text-slate-500"
        >
          این بازی در حال آماده‌سازی است.
          <br />
          به‌زودی می‌توانی با تصویرها بازی کنی و
          <br />
          ذهن و دقتت را به چالش بکشی.
        </motion.p>

        {/* Coming soon card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mx-auto mt-7 rounded-[28px] border border-indigo-100 bg-white p-5 shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🧠</span>

            <span className="text-sm font-black text-slate-700">
              یک بازی فکری جدید در راه است
            </span>

            <span className="text-2xl">✨</span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{
                delay: 0.8,
                duration: 1,
              }}
              className="h-full rounded-full bg-indigo-500"
              style={{
                background:
                  "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            />
          </div>

          <p className="mt-3 text-[11px] font-bold text-slate-400">
            در حال طراحی و توسعه...
          </p>
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          type="button"
          onClick={() => {
            window.location.href = "/games";
          }}
          className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-indigo-600"
        >
          ← بازگشت به منوی بازی‌ها
        </motion.button>

      </div>
    </main>
  );
}

