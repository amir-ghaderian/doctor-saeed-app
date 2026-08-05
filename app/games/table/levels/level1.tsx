"use client";

import { motion } from "framer-motion";

interface Level1Props {
  onComplete: () => void;
}

export default function Level1({ onComplete }: Level1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8"
    >
      <h1 className="text-3xl font-bold text-center text-cyan-700 mb-6">
        مرحله ۱
      </h1>

      <p className="text-center text-gray-600 mb-8">
        به بازی جدول خوش آمدید.
        <br />
        این مرحله فقط برای آشنایی با محیط بازی است.
      </p>

      <div className="flex justify-center">
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition"
        >
          پایان مرحله
        </button>
      </div>
    </motion.div>
  );
}