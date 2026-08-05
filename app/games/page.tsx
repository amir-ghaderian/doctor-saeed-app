"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// آیکون‌های ساده (می‌تونید از کتابخانه‌های آیکون هم استفاده کنید)
const icons = [
  "🧠", // ۱
  "💪", // ۲
  "🧘", // ۳
  "❤️", // ۴
  "⭐", // ۵
  "🌱", // ۶
  "🧩"
];

const cardData = [
  {
    id: 1,
    title: "آرامش ذهن",
    subtitle: "تمرکز و مدیتیشن",
    description: "تقویت آرامش ذهنی و افزایش تمرکز در زندگی روزمره",
    bgGradient: "from-purple-500 to-pink-500",
    hoverGradient: "from-purple-600 to-pink-600",
    tags: ["ذهن", "تمرکز", "آرامش", "مدیتیشن", "سکوت"],
  },
  {
    id: 2,
    title: "تناسب اندام",
    subtitle: "ورزش و تحرک",
    description: "سلامت جسمانی و افزایش انرژی با ورزش منظم",
    bgGradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
    tags: ["ورزش", "انرژی", "سلامت", "تحرک", "قدرت"],
  },
  {
    id: 3,
    title: "تغذیه سالم",
    subtitle: "رژیم و تغذیه",
    description: "تغذیه متعادل و سالم برای بدن و ذهن پویا",
    bgGradient: "from-green-500 to-emerald-500",
    hoverGradient: "from-green-600 to-emerald-600",
    tags: ["تغذیه", "سلامتی", "ویتامین", "رژیم", "انرژی"],
  },
  {
    id: 4,
    title: "سلامت روان",
    subtitle: "روانشناسی و خودشناسی",
    description: "شناخت خود و بهبود سلامت روان با رویکرد علمی",
    bgGradient: "from-rose-500 to-red-500",
    hoverGradient: "from-rose-600 to-red-600",
    tags: ["روان", "خودشناسی", "احساس", "آرامش", "پذیرش"],
  },
  {
    id: 5,
    title: "مدیریت استرس",
    subtitle: "کنترل و آرامش",
    description: "مدیریت استرس و اضطراب با تکنیک‌های اثربخش",
    bgGradient: "from-amber-500 to-orange-500",
    hoverGradient: "from-amber-600 to-orange-600",
    tags: ["استرس", "کنترل", "آرامش", "تنفس", "تمرکز"],
  },
  {
    id: 6,
    title: "رشد فردی",
    subtitle: "پیشرفت و تعالی",
    description: "رشد شخصی و رسیدن به بهترین نسخه خودت",
    bgGradient: "from-indigo-500 to-violet-500",
    hoverGradient: "from-indigo-600 to-violet-600",
    tags: ["رشد", "هدف", "پیشرفت", "موفقیت", "تعالی"],
  },

  {
    id: 7,
    title: "جدول",
    subtitle: "بازی ۸ مرحله‌ای",
    description: "یک بازی جذاب برای تقویت حافظه، تمرکز و قدرت ذهن",
    bgGradient: "from-teal-500 to-cyan-600",
    hoverGradient: "from-teal-600 to-cyan-700",
    tags: ["جدول", "بازی", "ذهن", "تمرکز", "مرحله‌ای"],
  },

];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 md:p-10">
      {/* هدر */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          🌟 مسیر سلامت روان و زندگی بهتر
        </h1>
        <p className="text-gray-600 text-sm md:text-lg">
          هر کارت نماینده یک قدم در مسیر رشد و تعالی شماست
        </p>
      </motion.div>

      {/* شبکه کارت‌ها */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cardData.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative group"
          >
            <Link href="/games/table">
              <motion.div
                className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer
    bg-gradient-to-br ${card.bgGradient} p-6 h-[280px] md:h-[320px] flex flex-col justify-between
    border-2 border-white/20 backdrop-blur-sm`}
              >
                {/* محتوای کارت */}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* فوتر */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12 text-gray-500 text-xs md:text-sm"
      >
        <p>🕊️ هر کارت، یک گام به سوی زندگی بهتر • برای شروع، روی هر کارت کلیک کنید</p>
      </motion.div>
    </main>
  );
}