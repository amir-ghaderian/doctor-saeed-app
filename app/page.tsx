"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div className="mb-8">
          <div className="text-7xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-sky-700 mb-4">
            انتخاب نسخه نمایش
          </h1>
          <p className="text-gray-600 text-lg">
            کدام نسخه از نمایش را می‌خواهید ببینید؟
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* نسخه بالون */}
          <Link href="/ballon-version1">
            <div className="bg-gradient-to-br from-sky-100 to-cyan-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group border-2 border-transparent hover:border-sky-400">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💬</div>
              <h2 className="text-2xl font-bold text-sky-700 mb-2">نسخه بالون</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                نمایش جملات به صورت بالون گفتگو روی عکس با موقعیت‌های مختلف
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium group-hover:bg-sky-700 transition-all">
                مشاهده نسخه 
              </div>
            </div>
          </Link>
          
          {/* نسخه تایپ */}
          <Link href="/page-version2">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group border-2 border-transparent hover:border-purple-400">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⌨️</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">نسخه تایپ</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                نمایش جملات به صورت تایپ شونده با افکت ماشین تحریر
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium group-hover:bg-purple-700 transition-all">
                مشاهده نسخه 
              </div>
            </div>
          </Link>
        </div>

        {/* دکمه اضافی برای برگشت (اختیاری) */}
        <div className="mt-8 text-sm text-gray-400">
          برای برگشت به این صفحه، روی دکمه "برگشت به صفحه اصلی" در هر نسخه کلیک کنید.
        </div>
      </div>
    </main>
  );
}