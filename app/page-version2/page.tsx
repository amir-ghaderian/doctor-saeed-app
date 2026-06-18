"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

export default function TypeVersion() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-100 flex items-center justify-center p-6">
      <Link href="/" className="fixed top-4 left-4 z-50">
        <button className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-gray-700 hover:text-sky-600">
          <span>←</span> برگشت به صفحه اصلی
        </button>
      </Link>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
           <div
  className="w-80 h-80 rounded-full shadow-xl bg-cover bg-center border-4 border-sky-400"
  style={{
    backgroundImage: "url('/pic/eshak.jpg')",
    backgroundPosition: "center 20%",
  }}
/>
          </motion.div>

          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h1 className="text-4xl font-bold text-sky-700 mb-6">خوش آمدید</h1>
            <div className="text-xl leading-10 text-gray-700 min-h-[180px]">
              <TypeAnimation
                sequence={[
                  "سلام، من دکتر سعید هستم.",
                  1000,
                  "سلام، من دکتر سعید هستم. می‌خواهم به شما روش‌هایی یاد بدهم تا خودتان را تست و محک بزنید.",
                  1000,
                  "سلام، من دکتر سعید هستم. می‌خواهم به شما روش‌هایی یاد بدهم تا خودتان را تست و محک بزنید و مسیر رشد فردی خود را بهتر بشناسید.",
                ]}
                speed={60}
                repeat={0}
              />
            </div>
            <button className="mt-8 px-8 py-4 bg-sky-600 hover:bg-sky-700 transition-all text-white rounded-xl text-lg font-semibold shadow-lg">
              شروع آموزش
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}