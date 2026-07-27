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
            <Link href={`/mental-health-form`}>
              <motion.div
                className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer
                  bg-gradient-to-br ${card.bgGradient} p-6 h-[280px] md:h-[320px] flex flex-col justify-between
                  border-2 border-white/20 backdrop-blur-sm`}
                animate={{
                  scale: hoveredCard === card.id ? 1.05 : 1,
                  rotate: hoveredCard === card.id ? [0, 1, -1, 0] : 0,
                }}
                transition={{
                  scale: { duration: 0.3 },
                  rotate: { duration: 0.5 },
                }}
                whileHover={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                {/* پس‌زمینه متحرک */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)`,
                  }}
                  animate={{
                    scale: hoveredCard === card.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* محتوای کارت */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* شماره و آیکون */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg md:text-xl"
                        animate={{
                          rotate: hoveredCard === card.id ? 360 : 0,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {card.id}
                      </motion.div>
                      <motion.span
                        className="text-2xl md:text-3xl"
                        animate={{
                          scale: hoveredCard === card.id ? 1.3 : 1,
                          rotate: hoveredCard === card.id ? [0, -10, 10, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {icons[index]}
                      </motion.span>
                    </div>
                  </div>

                  {/* عنوان و توضیحات */}
                  <div className="flex-1">
                    <motion.h3
                      className="text-white text-xl md:text-2xl font-bold mb-1"
                      animate={{
                        x: hoveredCard === card.id ? 5 : 0,
                      }}
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      className="text-white/80 text-sm md:text-base font-medium"
                      animate={{
                        x: hoveredCard === card.id ? 3 : 0,
                      }}
                    >
                      {card.subtitle}
                    </motion.p>
                    <motion.p
                      className="text-white/70 text-xs md:text-sm mt-2 line-clamp-2"
                      animate={{
                        opacity: hoveredCard === card.id ? 1 : 0.8,
                      }}
                    >
                      {card.description}
                    </motion.p>
                  </div>

                  {/* تگ‌ها */}
                  <motion.div
                    className="flex flex-wrap gap-1.5 mt-3"
                    animate={{
                      opacity: hoveredCard === card.id ? 1 : 0.7,
                      y: hoveredCard === card.id ? 0 : 5,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        className="text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium"
                        animate={{
                          scale: hoveredCard === card.id ? 1.1 : 1,
                        }}
                        whileHover={{
                          scale: 1.2,
                          backgroundColor: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* خط نورانی زیر کارت (hover) */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: hoveredCard === card.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* دکمه مخفی (مشاهده جزئیات) */}
                <motion.div
                  className="absolute bottom-4 right-4 z-10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: hoveredCard === card.id ? 1 : 0,
                    x: hoveredCard === card.id ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-xs font-medium bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    مشاهده بیشتر ←
                  </span>
                </motion.div>
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