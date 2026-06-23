"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

// تعریف type برای position
interface Position {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
  arrow: string;
}

export default function BalloonVersion() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    {
      text: "سلام، من دکتر سعید هستم.",
      position: 0
    },
    {
      text: "می‌خواهم به شما روش‌هایی یاد بدهم تا خودتان را تست و محک بزنید.",
      position: 1
    },
    {
      text: "تا مسیر رشد فردی خود را بهتر بشناسید.",
      position: 2
    },
  ];

  // موقعیت‌های متفاوت برای موبایل و دسکتاپ
  const getPositions = (isMobile: boolean): Position[] => {
    if (isMobile) {
      return [
        { top: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "bottom" },
        { bottom: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "top" },
        { bottom: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "top" },
        { bottom: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "top" },
      ];
    }
    return [
      { top: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "bottom" },
      { bottom: "-20px", left: "50%", transform: "translateX(-50%)", arrow: "top" },
      { top: "50%", left: "-30px", transform: "translateY(-50%)", arrow: "right" },
      { top: "50%", right: "-30px", transform: "translateY(-50%)", arrow: "left" },
    ];
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const positions = getPositions(isMobile);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[quoteIndex];
  const currentPosition = positions[currentQuote?.position % positions.length] || positions[0];
  
  const getArrowClasses = () => {
    switch(currentPosition.arrow) {
      case 'bottom': return 'bottom-[-12px] left-1/2 -translate-x-1/2 border-t-white';
      case 'top': return 'top-[-12px] left-1/2 -translate-x-1/2 border-b-white';
      case 'left': return 'left-[-12px] top-1/2 -translate-y-1/2 border-r-white';
      case 'right': return 'right-[-12px] top-1/2 -translate-y-1/2 border-l-white';
      default: return '';
    }
  };

  const getArrowBorder = () => {
    switch(currentPosition.arrow) {
      case 'bottom': return 'border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white';
      case 'top': return 'border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-white';
      case 'left': return 'border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-white';
      case 'right': return 'border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-white';
      default: return '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-100 flex items-center justify-center p-4 md:p-6">
      <Link href="/" className="fixed top-3 left-3 md:top-4 md:left-4 z-50">
        <button className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-sky-600">
          <span>←</span> <span className="hidden xs:inline">برگشت به صفحه اصلی</span>
          <span className="xs:hidden">بازگشت</span>
        </button>
      </Link>

      <div className="max-w-4xl w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center p-4 md:p-8">
          {/* بخش تصویر و بادکنک‌ها - تغییر ترتیب در موبایل */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className={`flex justify-center ${isMobile ? 'order-first' : 'order-none'}`}
          >
            <div className="relative inline-block w-full max-w-[280px] md:max-w-none">
              <div
                className="w-full h-72 md:h-96 rounded-2xl shadow-xl bg-cover bg-center border-4 border-sky-400"
                style={{
                  backgroundImage: "url('/pic/eshak.jpg')",
                  backgroundPosition: "center 20%",
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute z-20"
                  style={{
                    top: currentPosition.top,
                    bottom: currentPosition.bottom,
                    left: currentPosition.left,
                    right: currentPosition.right,
                    transform: currentPosition.transform,
                    maxWidth: isMobile ? '180px' : '240px',
                    width: isMobile ? '80%' : 'auto',
                  }}
                >
                  <div className="bg-white rounded-xl px-3 py-2.5 md:px-5 md:py-3.5 shadow-lg border-2 border-sky-300 relative">
                    <p className="text-gray-800 text-xs md:text-sm font-medium leading-relaxed text-center">
                      {currentQuote.text}
                    </p>
                    <div className={`absolute ${getArrowClasses()} w-0 h-0 ${getArrowBorder()}`} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* نقطه‌های پایین - همیشه در پایین */}
              <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
                {quotes.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      index === quoteIndex ? 'bg-sky-600 w-6 md:w-8' : 'bg-sky-200'
                    }`}
                    style={{ height: isMobile ? '8px' : '10px', width: index === quoteIndex ? (isMobile ? '24px' : '32px') : (isMobile ? '8px' : '10px') }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* بخش متن - تغییر در موبایل */}
          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center md:text-right"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-sky-700 mb-4 md:mb-6">
              خوش آمدید
            </h1>
            <div className="space-y-3 md:space-y-4">
              <div className={`flex items-start gap-3 ${isMobile ? 'justify-center' : ''}`}>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  در این مسیر همراه شما هستیم تا بهترین نسخه خودتان را بسازید.
                </p>
              </div>
              <div className={`flex items-start gap-3 ${isMobile ? 'justify-center' : ''}`}>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  با روش‌های علمی و عملی، خودتان را بهتر بشناسید.
                </p>
              </div>
            </div>
            <button className="mt-4 md:mt-6 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition-all text-white rounded-xl text-sm md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full md:w-auto">
              شروع آموزش
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}