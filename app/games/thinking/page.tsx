"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const BACKGROUND_IMAGE = "/pic/bg.jpg";
const DOCTOR_IMAGE = "/pic/dr.png";

const games = [
  {
    title: "کَلَمَک",
    description: "تمرین کلمات، تمرکز و سرعت پردازش ذهنی",
    icon: "🧩",
    href: "/games/thinking/table",
  },
  {
    title: "تَصویرَک",
    description: "تمرین حافظه، تمرکز و سرعت پردازش ذهنی",
    icon: "🖼️",
    href: "/games/thinking/visual",
  },
];

const conversations = [
  "بازی‌های فکری فقط برای سرگرمی نیستند؛ آن‌ها می‌توانند به تقویت تمرکز و دقت کمک کنند. 🧠",
  "وقتی برای پیدا کردن پاسخ، توجهت رو روی یک مسئله حفظ می‌کنی، در واقع داری تمرکزت رو تمرین می‌کنی.",
  "حل جدول، بازی‌های حروفی و پیدا کردن الگوها، توجه به جزئیات و دقت ذهنی رو تقویت می‌کنن.",
  "حالا آماده‌ای؟ 🎯 بیا با چند بازی ساده، حافظه، تمرکز و سرعت پردازش ذهنت رو به چالش بکشیم!",
];

export default function ThinkingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [closing, setClosing] = useState(false);
  const [visibleBubbles, setVisibleBubbles] = useState(0);

  useEffect(() => {
    if (!showIntro || closing) return;

    const timers: number[] = [];

    conversations.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setVisibleBubbles(index + 1);
      }, 800 + index * 2000);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [showIntro, closing]);

  const closeIntro = () => {
    if (closing) return;

    setClosing(true);

    window.setTimeout(() => {
      setShowIntro(false);
    }, 800);
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden px-6 py-12"
      style={{
        backgroundImage: `url("${BACKGROUND_IMAGE}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/75" />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-indigo-950/60 to-purple-950/70" />

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <div className="mb-5 text-6xl">🧠</div>

          <h1 className="text-4xl font-black text-white md:text-5xl">
            بازی‌های فکری
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            مجموعه‌ای از بازی‌های طراحی‌شده برای تقویت حافظه، تمرکز و عملکرد ذهنی
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <Link href={game.href}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl transition-all duration-500 group-hover:bg-purple-400/30" />

                  <div className="relative">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-5xl shadow-lg backdrop-blur-md">
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

      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="doctor-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.25,
              },
            }}
            onClick={closeIntro}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/90 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-5 max-md:px-2 max-md:py-3"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 35,
              }}
              animate={
                closing
                  ? {
                      opacity: 0,
                      scale: 0.98,
                      y: "110vh",
                      transition: {
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
              }
              onClick={(event) => event.stopPropagation()}
              className="relative flex h-[min(720px,92vh)] w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/90 shadow-[0_30px_100px_rgba(0,0,0,0.6)] max-md:h-[calc(100dvh-24px)] max-md:max-h-[720px] max-md:min-h-0 max-md:max-w-[430px] max-md:rounded-[26px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/70 via-slate-950/95 to-purple-950/80" />

              <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

              <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

              {/* Close button */}
              <button
                type="button"
                aria-label="بستن"
                onClick={(event) => {
                  event.stopPropagation();
                  closeIntro();
                }}
                className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl leading-none text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 max-md:right-2.5 max-md:top-2.5 max-md:h-9 max-md:w-9 max-md:text-xl"
              >
                ×
              </button>

              {/* Doctor — LEFT */}
              <div className="relative flex w-[45%] items-end justify-center overflow-hidden max-md:w-[37%] max-md:items-end max-md:justify-center">
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                  }}
                  className="absolute bottom-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[100px] max-md:bottom-8 max-md:h-44 max-md:w-44 max-md:blur-[60px]"
                />

                <motion.img
                  src={DOCTOR_IMAGE}
                  alt="دکتر سعید"
                  initial={{
                    opacity: 0,
                    x: -220,
                  }}
                  animate={
                    closing
                      ? {
                          opacity: 0,
                          x: -100,
                        }
                      : {
                          opacity: 1,
                          x: 0,
                        }
                  }
                  transition={{
                    duration: 0.95,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-10 max-h-[94%] w-auto max-w-[96%] object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)] max-md:max-h-[64%] max-md:max-w-[145%]"
                />

                <div className="absolute bottom-5 left-1/2 h-3 w-48 -translate-x-1/2 rounded-full bg-white/10 blur-xl max-md:bottom-5 max-md:h-2 max-md:w-24" />

                {/* Pointing glow */}
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute right-[5%] top-[43%] z-20 h-16 w-16 rounded-full bg-indigo-400/20 blur-2xl max-md:h-10 max-md:w-10"
                />
              </div>

              {/* Conversation — RIGHT */}
              <div
                className="
                  relative
                  z-20
                  flex
                  w-[55%]
                  flex-col
                  justify-start
                  px-12
                  py-12

                  max-md:w-[63%]
                  max-md:justify-start
                  max-md:overflow-hidden
                  max-md:px-2.5
                  max-md:pb-16
                  max-md:pt-12
                "
              >
                {/* Fixed header */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 60,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mb-8 shrink-0 max-md:mb-3"
                >
                  <div className="mb-4 flex items-center gap-3 max-md:mb-2.5 max-md:gap-1.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-indigo-500/15 text-xl shadow-lg max-md:h-7 max-md:w-7 max-md:rounded-lg max-md:text-sm">
                      🧠
                    </div>

                    <div>
                      <p className="text-xs font-medium text-indigo-300 max-md:text-[9px]">
                        دکتر سعید
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-white max-md:text-[10px]">
                        بازی‌های فکری
                      </p>
                    </div>
                  </div>

                  <h2 className="text-3xl font-black leading-tight text-white md:text-4xl max-md:text-[17px] max-md:leading-6">
                    اهمیت بازی‌های فکری
                    <br />
                    برای ذهن
                  </h2>
                </motion.div>

                {/* Messages */}
                <div className="flex flex-col gap-4 max-md:gap-1.5">
                  <AnimatePresence initial={false}>
                    {conversations.map((message, index) => {
                      if (index >= visibleBubbles) return null;

                      const isLast = index === conversations.length - 1;

                      return (
                        <motion.div
                          key={message}
                          initial={{
                            opacity: 0,
                            x: 70,
                            y: 8,
                            scale: 0.94,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex justify-start"
                        >
                          <div
                            className={`
                              relative
                              max-w-[92%]
                              rounded-2xl
                              px-5
                              py-3.5
                              text-sm
                              leading-7
                              shadow-xl
                              backdrop-blur-xl

                              max-md:max-w-[99%]
                              max-md:rounded-xl
                              max-md:px-2
                              max-md:py-1.5
                              max-md:text-[10px]
                              max-md:leading-[1.42rem]

                              ${
                                isLast
                                  ? "border border-indigo-400/25 bg-indigo-500/20 text-white"
                                  : "border border-white/10 bg-white/[0.07] text-slate-200"
                              }
                            `}
                          >
                            <div
                              className={`
                                absolute
                                -right-1.5
                                top-5
                                h-3
                                w-3
                                rotate-45
                                border-r
                                border-t

                                max-md:-right-1
                                max-md:top-3
                                max-md:h-2
                                max-md:w-2

                                ${
                                  isLast
                                    ? "border-indigo-400/25 bg-indigo-500/20"
                                    : "border-white/10 bg-white/[0.07]"
                                }
                              `}
                            />

                            {message}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Desktop touch hint */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity:
                      visibleBubbles >= conversations.length ? 1 : 0,
                    y: visibleBubbles >= conversations.length ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="mt-8 flex items-center gap-2 text-xs text-slate-400 max-md:hidden"
                >
                  <motion.span
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10"
                  >
                    👆
                  </motion.span>

                  برای ادامه، هر جای صفحه را لمس کنید
                </motion.div>

                {/* Mobile enter button */}
                <motion.button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeIntro();
                  }}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity:
                      visibleBubbles >= conversations.length ? 1 : 0,
                    y: visibleBubbles >= conversations.length ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="hidden max-md:absolute max-md:bottom-3 max-md:left-2.5 max-md:right-2.5 max-md:flex max-md:h-10 max-md:items-center max-md:justify-center max-md:rounded-xl max-md:border max-md:border-indigo-300/20 max-md:bg-indigo-500/20 max-md:px-4 max-md:text-xs max-md:font-bold max-md:text-white max-md:shadow-lg max-md:backdrop-blur-md max-md:transition-all max-md:duration-200 active:max-md:scale-[0.98]"
                >
                  ورود به بازی
                </motion.button>
              </div>

              {/* Desktop bottom hint */}
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2 max-md:hidden">
                <motion.div
                  animate={{
                    opacity: [0.35, 0.8, 0.35],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] text-white/50 backdrop-blur-md"
                >
                  برای ورود لمس کنید
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}