"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BalloonVersion() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const quotes = [
    {
      text: "سلام، من دکتر سعید هستم.",
    },
    {
      text: "سلامت روان، مهم‌ترین عامل موفقیت در تمام جنبه‌های زندگی",
    },
    {
      text: "ذهن آرام و متمرکز = تصمیم‌های بهتر + عملکرد مطلوب‌تر",
    },
    {
      text: "ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند",
    },
    {
      text: "سلامت روان به اندازه سلامت جسم اهمیت دارد",
    },
    {
      text: "تمرین تمرکز و مهارت‌های شناختی، عملکرد ذهن را بهبود می‌بخشد",
    },
    {
      text: "سلامت روان = کیفیت زندگی + موفقیت + آینده‌ای سالم‌تر",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[quoteIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-100 flex items-center justify-center p-4 md:p-6">
      <Link href="/" className="fixed top-3 left-3 md:top-4 md:left-4 z-50">
        <button className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-sky-600">
          <span>←</span> <span className="hidden xs:inline">برگشت به صفحه اصلی</span>
          <span className="xs:hidden">بازگشت</span>
        </button>
      </Link>

      <div className="max-w-4xl w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center p-4 md:p-8 overflow-visible">
          {/* بخش تصویر و بادکنک */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center overflow-visible"
          >
            <div className="relative inline-block w-full max-w-[280px] md:max-w-none overflow-visible">
              <div
                className="w-full h-72 md:h-96 rounded-2xl shadow-xl bg-cover bg-center border-4 border-sky-400 overflow-hidden"
                style={{
                  backgroundImage: "url('/pic/eshak3.png')",
                  backgroundPosition: "center 20%",
                }}
              />

              {isMobile ? (
                // حالت موبایل: بادکنک در سمت راست بالای عکس (نزدیک دهان دکتر)
                <div className="absolute top-[15%] -right-6 transform -translate-y-1/2 z-20 w-[180px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, x: 15, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -15, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white rounded-xl px-3 py-2.5 shadow-lg border-2 border-sky-300 relative">
                        <p className="text-gray-800 text-[10px] sm:text-xs font-medium leading-relaxed text-center">
                          {currentQuote.text}
                        </p>
                        {/* فلش چپ (نشانه به سمت دهان دکتر) */}
                        <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 
                          border-t-[8px] border-t-transparent 
                          border-b-[8px] border-b-transparent 
                          border-r-[12px] border-r-white" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                // حالت دسکتاپ: بادکنک سمت راست عکس - نشانه به سمت دکتر
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 z-20 w-[200px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, x: 15, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -15, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white rounded-xl px-3 py-2.5 shadow-lg border-2 border-sky-300 relative">
                        <p className="text-gray-800 text-xs md:text-sm font-medium leading-relaxed text-center">
                          {currentQuote.text}
                        </p>
                        {/* فلش چپ (نشانه به سمت دکتر) */}
                        <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 
                          border-t-[8px] border-t-transparent 
                          border-b-[8px] border-b-transparent 
                          border-r-[12px] border-r-white" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* بخش متن */}
          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center md:text-right"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-sky-700 mb-4 md:mb-6">
              سلامت روان در ورزش و زندگی
            </h1>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  ذهن آرام و متمرکز، تصمیم‌های بهتر و عملکرد مطلوب‌تر می‌سازد
                </p>
              </div>
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند
                </p>
              </div>
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  سرمایه‌گذاری روی سلامت روان = کیفیت زندگی بهتر
                </p>
              </div>
            </div>
            <button className="mt-4 md:mt-6 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition-all text-white rounded-xl text-sm md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full md:w-auto">
              شروع مسیر سلامت روان
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}