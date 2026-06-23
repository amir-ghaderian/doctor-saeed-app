"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function TypeVersion() {
  const [isMobile, setIsMobile] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  // تشخیص دیده شدن بخش تایپ
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // وقتی بخش تایپ دیده شد، تایپ شروع شود
  useEffect(() => {
    if (inView && !startTyping) {
      setStartTyping(true);
    }
  }, [inView, startTyping]);

  const getSequence = () => {
    if (isMobile) {
      return [
        "سلام، من دکتر سعید هستم.",
        1000,
        "سلام، من دکتر سعید هستم. می‌خواهم روش‌هایی یاد بدهم تا خودتان را تست کنید.",
        1000,
        "سلام، من دکتر سعید هستم. می‌خواهم روش‌هایی یاد بدهم تا خودتان را تست کنید و مسیر رشد فردی را بهتر بشناسید.",
      ];
    }
    return [
      "سلام، من دکتر سعید هستم.",
      1000,
      "سلام، من دکتر سعید هستم. می‌خواهم به شما روش‌هایی یاد بدهم تا خودتان را تست و محک بزنید.",
      1000,
      "سلام، من دکتر سعید هستم. می‌خواهم به شما روش‌هایی یاد بدهم تا خودتان را تست و محک بزنید و مسیر رشد فردی خود را بهتر بشناسید.",
    ];
  };

  // تعیین نحوه نمایش تصویر بر اساس دستگاه
  const getBackgroundSize = () => {
    return isMobile ? 'cover' : 'contain';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
      {/* دکمه بازگشت */}
      <Link href="/" className="fixed top-3 left-3 md:top-4 md:left-4 z-50">
        <button className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-sky-600">
          <span>←</span> <span className="hidden xs:inline">برگشت به صفحه اصلی</span>
          <span className="xs:hidden">بازگشت</span>
        </button>
      </Link>

      {/* بخش بنر - تصویر با اندازه مناسب برای هر دستگاه */}
      <section 
        className="w-full bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/pic/eshak2.png')",
          backgroundSize: getBackgroundSize(),
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          minHeight: "100vh",
        }}
      >
        {/* لایه گرادیانت برای زیبایی */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        
        {/* محتوای روی بنر */}
        <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold drop-shadow-2xl tracking-wide">
              Dr. Saeed
            </h1>
            <div className="w-16 sm:w-20 h-1 bg-sky-400 mx-auto my-2 md:my-4 rounded-full" />
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl drop-shadow-xl tracking-[0.15em]">
              SPORTS PSYCHIATRIST
            </p>
            
            {/* کلمات کلیدی زیر نام */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-center mt-3 md:mt-6">
              {["MIND", "FOCUS", "CONFIDENCE", "PERFORMANCE"].map((word) => (
                <span 
                  key={word}
                  className="px-2 sm:px-3 md:px-4 py-1 md:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] sm:text-xs md:text-sm font-semibold border border-white/30"
                >
                  {word}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* فلش پایین برای اسکرول */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/60 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* بخش متن تایپ‌رایتر - با ref برای تشخیص اسکرول */}
      <section 
        ref={ref}
        className="w-full bg-gradient-to-b from-white to-sky-50/50"
      >
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10 lg:p-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-sky-700 mb-3 md:mb-6">
              خوش آمدید
            </h1>
            
            <div className="text-sm sm:text-base md:text-xl leading-7 sm:leading-8 md:leading-10 text-gray-700 min-h-[100px] sm:min-h-[120px] md:min-h-[180px]">
              {startTyping ? (
                <TypeAnimation
                  key={isMobile ? 'mobile' : 'desktop'}
                  sequence={getSequence()}
                  speed={isMobile ? 50 : 60}
                  repeat={0}
                  className="inline-block"
                />
              ) : (
                <span className="text-gray-400 opacity-50">
                  برای دیدن پیام اسکرول کنید...
                </span>
              )}
            </div>
            
            <button className="mt-4 md:mt-8 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition-all text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto">
              شروع آموزش
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}