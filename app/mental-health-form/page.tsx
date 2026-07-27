"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MentalHealthForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    occupation: "",
    sleepHours: "",
    stressLevel: "",
    mentalHealthGoal: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اینجا می‌تونید داده‌ها رو به سرور ارسال کنید
    console.log("فرم ارسال شد:", formData);
    setIsSubmitted(true);
    // بعد از ۳ ثانیه فرم رو ریست کنید
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: "",
        age: "",
        occupation: "",
        sleepHours: "",
        stressLevel: "",
        mentalHealthGoal: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-100 flex items-center justify-center p-4 md:p-6">
      <Link href="/" className="fixed top-3 left-3 md:top-4 md:left-4 z-50">
        <button className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-sky-600">
          <span>←</span> <span className="hidden xs:inline">برگشت به صفحه اصلی</span>
          <span className="xs:hidden">بازگشت</span>
        </button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-sky-700 mb-2">
            شروع مسیر سلامت روان
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            لطفاً اطلاعات زیر را تکمیل کنید تا بهترین راهنمایی را دریافت کنید
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-400 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">اطلاعات با موفقیت ثبت شد!</h3>
            <p className="text-green-600">به زودی با شما تماس خواهیم گرفت</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
            {/* فیلد ۱: نام کامل */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base"
                placeholder="مثال: سعید رضایی"
              />
            </div>

            {/* فیلد ۲: سن */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                سن
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base"
                placeholder="مثال: ۲۸"
              />
            </div>

            {/* فیلد ۳: شغل */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                شغل
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base"
                placeholder="مثال: ورزشکار حرفه‌ای"
              />
            </div>

            {/* فیلد ۴: ساعت خواب */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                میانگین ساعت خواب در شبانه‌روز
              </label>
              <input
                type="number"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                required
                min="1"
                max="24"
                step="0.5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base"
                placeholder="مثال: ۷"
              />
            </div>

            {/* فیلد ۵: سطح استرس */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                سطح استرس خود را ارزیابی کنید
              </label>
              <select
                name="stressLevel"
                value={formData.stressLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base bg-white"
              >
                <option value="">انتخاب کنید...</option>
                <option value="very-low">خیلی کم</option>
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
                <option value="very-high">خیلی زیاد</option>
              </select>
            </div>

            {/* فیلد ۶: هدف از سلامت روان */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                هدف اصلی شما از بهبود سلامت روان چیست؟
              </label>
              <textarea
                name="mentalHealthGoal"
                value={formData.mentalHealthGoal}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-sm md:text-base resize-none"
                placeholder="مثال: کاهش استرس قبل از مسابقات ورزشی..."
              />
            </div>

            {/* دکمه ارسال */}
            <button
              type="submit"
              className="w-full mt-4 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition-all text-white rounded-xl text-sm md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ثبت اطلاعات و شروع مسیر
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}