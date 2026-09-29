"use client";

import { useEffect, useState } from "react";

const HERO_IMAGE = "/pic/psy2.jpeg";

const heroSlogans = [
  "بدن آماده، عملکرد بهتر",
  "قدرت بیشتر، اجرای بهتر",
  "ذهن آماده، بدن آماده",
  "هر حرکت، ترکیبی از قدرت و تمرکز است",
  "ریکاوری بهتر، عملکرد پایدارتر",
];

export default function SportsPillarsPage() {
  const [activeSlogan, setActiveSlogan] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlogan((prev) => (prev + 1) % heroSlogans.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const pillars = [
    {
      number: "۱",
      title: "قدرت",
      text: "توانایی تولید نیرو توسط عضلات؛ یکی از پایه‌های اصلی اجرای قدرتمند و کنترل‌شده حرکات ورزشی.",
    },
    {
      number: "۲",
      title: "استقامت",
      text: "توانایی ادامه فعالیت برای مدت طولانی و مقابله با خستگی در طول تمرین یا مسابقه.",
    },
    {
      number: "۳",
      title: "سرعت",
      text: "توانایی انجام یک حرکت یا واکنش در کوتاه‌ترین زمان ممکن.",
    },
    {
      number: "۴",
      title: "توان انفجاری",
      text: "توانایی تولید نیروی زیاد در مدت کوتاه؛ عاملی مهم در حرکات سریع و قدرتمند.",
    },
    {
      number: "۵",
      title: "چابکی",
      text: "توانایی تغییر سریع و کنترل‌شده جهت و وضعیت بدن در پاسخ به شرایط مختلف.",
    },
    {
      number: "۶",
      title: "انعطاف‌پذیری",
      text: "داشتن دامنه مناسب حرکت مفاصل و عضلات برای اجرای روان‌تر و مؤثرتر حرکات.",
    },
    {
      number: "۷",
      title: "تعادل",
      text: "توانایی حفظ کنترل، ثبات و وضعیت مناسب بدن هنگام حرکت یا اجرای مهارت.",
    },
    {
      number: "۸",
      title: "هماهنگی عصبی–عضلانی",
      text: "هماهنگی دقیق میان مغز، اعصاب و عضلات برای اجرای سریع، دقیق و مؤثر حرکات.",
    },
    {
      number: "۹",
      title: "تکنیک و مهارت ورزشی",
      text: "اجرای صحیح و مؤثر حرکات تخصصی هر رشته بر اساس اصول فنی و نیازهای ورزشکار.",
    },
    {
      number: "۱۰",
      title: "تمرکز و آمادگی ذهنی",
      text: "کنترل توجه، تصمیم‌گیری و مدیریت فشار مسابقه برای حفظ کیفیت عملکرد در شرایط رقابتی.",
    },
    {
      number: "۱۱",
      title: "ریکاوری و تغذیه",
      text: "بازسازی بدن، خواب کافی و تأمین انرژی مورد نیاز برای تمرین، مسابقه و سازگاری بدن.",
    },
  ];

  const performanceFactors = [
    {
      title: "آمادگی جسمانی",
      text: "بدن باید برای نیازهای واقعی رشته ورزشی آماده باشد.",
    },
    {
      title: "تکنیک",
      text: "اجرای درست حرکات، توان بدن را به عملکرد مؤثر تبدیل می‌کند.",
    },
    {
      title: "آمادگی ذهنی",
      text: "تمرکز و تصمیم‌گیری در لحظه‌های مهم، بخشی از عملکرد ورزشکار است.",
    },
    {
      title: "تغذیه",
      text: "تأمین انرژی و مواد مورد نیاز بدن، پایه تمرین و ریکاوری است.",
    },
    {
      title: "ریکاوری",
      text: "خواب و استراحت به بدن فرصت سازگاری و بازسازی می‌دهند.",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-white text-slate-800 selection:bg-orange-200"
    >
      <style>{`
        @keyframes sloganIn {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }

          18% {
            opacity: 1;
            transform: translateY(0);
          }

          78% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
            transform: translateY(-12px);
          }
        }

        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-slogan {
          animation: sloganIn 3.5s ease-in-out both;
        }

        .sports-card {
          animation: cardReveal 0.65s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-slogan,
          .sports-card {
            animation: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="bg-white">
        <div className="px-3 pt-3 sm:p-0">
          <div className="relative overflow-hidden rounded-2xl bg-white sm:rounded-none">
            <img
              src={HERO_IMAGE}
              alt="ورزشکاران در رشته‌های مختلف ورزشی"
              className="block h-auto w-full sm:h-[76svh] sm:min-h-0 sm:object-cover sm:object-center lg:h-[82svh]"
            />




            <div className="absolute inset-x-0 bottom-0 px-4 pb-1 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
              <div className="mx-auto flex max-w-6xl justify-center">
                <div className="relative flex min-h-[48px] max-w-[94%] items-center justify-center overflow-hidden rounded-full bg-white px-5 py-2.5 sm:min-h-[58px] sm:px-9">
                  <div
                    key={activeSlogan}
                    className="hero-slogan whitespace-nowrap text-center text-[11px] font-black leading-none text-slate-800 sm:text-lg lg:text-2xl"
                  >
                    {heroSlogans[activeSlogan]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO ACTIONS — سفید و یکدست با بدنه */}
        <div className="flex flex-wrap justify-center gap-3 bg-white px-4 py-6 sm:py-8">
          <a
            href="#pillars"
            className="rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:shadow-xl sm:px-7"
          >
            مشاهده ارکان ورزش
          </a>

          <a
            href="#performance"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md sm:px-7"
          >
            فرمول عملکرد ورزشی
          </a>
        </div>
      </section>

      {/* HEADER */}
      <section className="bg-white px-5 pt-2 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-600/15">
            
            </span>

            ارکان ورزش
          </div>

          <span className="rounded-full border border-orange-100 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-500 backdrop-blur sm:text-xs">
            آمادگی جسمانی و عملکرد ورزشی
          </span>
        </nav>
      </section>

      {/* INTRO */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-sm font-bold text-orange-600">
                نقشه راه ورزشکار
              </span>

              <h2 className="mt-3 text-3xl font-black leading-[1.5] text-slate-900 sm:text-4xl">
                عملکرد ورزشی فقط به قوی‌تر بودن محدود نمی‌شود.
              </h2>

              <div className="mt-5 h-1 w-16 rounded-full bg-orange-600" />
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-9">
              <p className="text-justify text-base leading-9 text-slate-600 sm:text-lg">
                برای رسیدن به عملکرد مطلوب، ورزشکار باید چند بُعد اصلی را
                هم‌زمان توسعه دهد. قدرت، استقامت، سرعت، توان انفجاری، چابکی و
                انعطاف‌پذیری، پایه آمادگی جسمانی را شکل می‌دهند. در کنار آن،
                تعادل، هماهنگی عصبی–عضلانی، تکنیک و مهارت ورزشی، تمرکز و
                آمادگی ذهنی، تغذیه و ریکاوری نیز نقش مهمی در کیفیت عملکرد
                ورزشکار دارند.
              </p>

              <div className="mt-6 border-r-2 border-orange-500 bg-orange-50/70 px-5 py-4 text-sm font-semibold leading-8 text-slate-700">
                عملکرد پایدار زمانی شکل می‌گیرد که بدن، ذهن، مهارت، تغذیه و
                فرایند بازیابی در کنار یکدیگر توسعه پیدا کنند.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section
        id="pillars"
        className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-orange-600">
                ارکان اصلی
              </span>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                ۱۱ بُعد مهم برای ورزشکار
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600">
              هر کدام از این ارکان بخشی از پازل عملکرد هستند و در کنار یکدیگر
              تصویر کامل‌تری از آمادگی ورزشکار می‌سازند.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.number}
                className="sports-card group relative min-h-[190px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:min-h-[215px] sm:rounded-[1.75rem] sm:p-6 lg:min-h-[225px]"
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <div className="absolute right-0 top-0 h-full w-1 bg-orange-600 transition-all duration-500 group-hover:w-1.5" />

                <div className="relative flex h-full flex-col justify-between pr-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-orange-600 sm:text-3xl">
                      {pillar.number}
                    </span>

                    <span className="text-xs font-bold tracking-wide text-slate-300">
                      SPORTS
                    </span>
                  </div>

                  <div className="mt-7">
                    <h3 className="text-base font-black text-slate-900 sm:text-xl">
                      {pillar.title}
                    </h3>

                    <p className="mt-3 text-[11px] leading-6 text-slate-500 sm:text-sm sm:leading-7">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BODY / MIND */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <span className="text-sm font-bold text-orange-600">
              بدن و ذهن
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              آمادگی واقعی، ترکیبی است.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              عملکرد ورزشی فقط نتیجه عضلات قوی نیست. ورزشکار باید بتواند توان
              جسمی خود را با تصمیم‌گیری، تمرکز، کنترل توجه و اجرای صحیح مهارت
              ترکیب کند.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="group rounded-[2rem] border border-orange-100 bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-9">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-sm font-black text-orange-600">
                  ۰۱
                </span>

                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300">
                  BODY
                </span>
              </div>

              <h3 className="mt-7 text-2xl font-black text-slate-900">
                آمادگی جسمانی
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                قدرت، استقامت، سرعت، توان انفجاری، چابکی، انعطاف‌پذیری،
                تعادل و هماهنگی بدن، ظرفیت اجرای فیزیکی ورزشکار را می‌سازند.
              </p>

              <div className="mt-7 h-1 w-14 rounded-full bg-orange-600 transition-all duration-500 group-hover:w-24" />
            </article>

            <article className="group rounded-[2rem] bg-slate-900 p-7 text-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.16)] sm:p-9">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-sm font-black text-white">
                  ۰۲
                </span>

                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30">
                  MIND
                </span>
              </div>

              <h3 className="mt-7 text-2xl font-black">
                آمادگی ذهنی
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                تمرکز، کنترل توجه، تصمیم‌گیری، مدیریت فشار و توانایی بازگشت
                ذهن به وظیفه اصلی، کیفیت اجرای ورزشکار را در شرایط مسابقه
                تحت تأثیر قرار می‌دهد.
              </p>

              <div className="mt-7 h-1 w-14 rounded-full bg-orange-500 transition-all duration-500 group-hover:w-24" />
            </article>
          </div>
        </div>
      </section>

      {/* PERFORMANCE SYSTEM */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <span className="text-sm font-bold text-orange-400">
                  یک سیستم، چند بخش
                </span>

                <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  عملکرد بهتر، نتیجه یک مجموعه کامل است.
                </h2>

                <p className="mt-5 text-sm leading-8 text-slate-300 sm:text-base">
                  ورزشکار برای عملکرد پایدار باید میان تمرین، مهارت، ذهن،
                  تغذیه و بازیابی تعادل ایجاد کند.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {performanceFactors.map((factor, index) => (
                  <article
                    key={factor.title}
                    className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.07]"
                  >
                    <span className="text-xs font-black text-orange-400">
                      ۰{index + 1}
                    </span>

                    <h3 className="mt-4 text-sm font-black">
                      {factor.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      {factor.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULA */}
      <section
        id="performance"
        className="bg-white px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-12">
            <div className="relative max-w-4xl">
              <span className="text-sm font-bold text-orange-600">
                فرمول عملکرد ورزشی
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                عملکرد بهتر، حاصل یک سیستم کامل است.
              </h2>

              <div className="mt-8 rounded-3xl bg-slate-900 p-6 text-center shadow-xl sm:p-8">
                <p className="text-base font-black leading-9 text-white sm:text-xl sm:leading-[2.4]">
                  آمادگی جسمانی
                  <span className="mx-2 text-orange-500">+</span>
                  تکنیک
                  <span className="mx-2 text-orange-500">+</span>
                  آمادگی ذهنی
                  <span className="mx-2 text-orange-500">+</span>
                  تغذیه
                  <span className="mx-2 text-orange-500">+</span>
                  ریکاوری
                  <span className="mx-2 text-orange-500">=</span>
                  عملکرد بهتر ورزشی
                </p>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
                هدف از توسعه این ارکان، ساختن ورزشکاری متعادل‌تر و آماده‌تر
                برای نیازهای رشته ورزشی است؛ ورزشکاری که نه‌تنها بهتر تمرین
                می‌کند، بلکه بهتر اجرا می‌کند و بهتر بازیابی می‌شود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-orange-100 bg-white px-5 py-8 text-center text-sm text-slate-500">
        ارکان ورزش و آمادگی جسمانی • مسیر رشد جسم، مهارت و ذهن
      </footer>
    </main>
  );
}