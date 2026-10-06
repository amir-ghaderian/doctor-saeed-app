import React from "react";

const quotes = [
  "سلام، من دکتر سعید هستم.",
  "سلامت روان، مهم‌ترین عامل موفقیت در تمام جنبه‌های زندگی",
  "ذهن آرام و متمرکز = تصمیم‌های بهتر + عملکرد مطلوب‌تر",
  "ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند",
  "سلامت روان به اندازه سلامت جسم اهمیت دارد",
  "تمرین تمرکز و مهارت‌های شناختی، عملکرد ذهن را بهبود می‌بخشد",
  "سلامت روان = کیفیت زندگی + موفقیت + آینده‌ای سالم‌تر",
];

const benefits = [
  "ذهن آرام و متمرکز، تصمیم‌های بهتر و عملکرد مطلوب‌تر می‌سازد",
  "ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند",
  "سرمایه‌گذاری روی سلامت روان = کیفیت زندگی بهتر",
];

export default function BalloonVersion() {
  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-[#f7fbfd]
        px-3 py-3
        sm:px-5 sm:py-5
        lg:px-8 lg:py-8
      "
    >
      <style>{`
        @keyframes safeFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes safeQuote {
          0%,
          11% {
            opacity: 1;
            transform: translateY(0);
          }

          14%,
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }

        .safe-fade-up {
          animation: safeFadeUp 0.65s ease-out both;
        }

        .safe-fade-up-delay {
          animation: safeFadeUp 0.65s ease-out 0.12s both;
        }

        .balloon-quote {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 16px;
          text-align: center;
          opacity: 0;
          transform: translateY(0);
          animation: safeQuote 28s linear infinite;
          will-change: opacity, transform;
        }

        .balloon-quote:first-child {
          opacity: 1;
        }

        .balloon-quote:nth-child(1) {
          animation-delay: 0s;
        }

        .balloon-quote:nth-child(2) {
          animation-delay: -4s;
        }

        .balloon-quote:nth-child(3) {
          animation-delay: -8s;
        }

        .balloon-quote:nth-child(4) {
          animation-delay: -12s;
        }

        .balloon-quote:nth-child(5) {
          animation-delay: -16s;
        }

        .balloon-quote:nth-child(6) {
          animation-delay: -20s;
        }

        .balloon-quote:nth-child(7) {
          animation-delay: -24s;
        }

        @media (prefers-reduced-motion: reduce) {
          .safe-fade-up,
          .safe-fade-up-delay,
          .balloon-quote {
            animation: none !important;
          }

          .balloon-quote {
            display: none;
          }

          .balloon-quote:first-child {
            display: flex;
            opacity: 1;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-sky-100
            opacity-70
            sm:-right-32
            sm:-top-32
            sm:h-80
            sm:w-80
          "
        />

        <div
          className="
            absolute
            -bottom-28
            -left-28
            h-72
            w-72
            rounded-full
            bg-cyan-100
            opacity-60
            sm:-bottom-40
            sm:-left-40
            sm:h-96
            sm:w-96
          "
        />
      </div>

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1380px]
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200
          bg-white
          shadow-lg
          sm:rounded-[30px]
          lg:rounded-[36px]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-4
            py-3
            sm:px-6
            sm:py-4
            lg:px-8
          "
        >
          <div className="flex min-w-0 items-center">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-sky-50
                text-sky-600
                sm:h-10
                sm:w-10
              "
            >
              <span className="text-lg">✦</span>
            </div>

            <div className="mr-2 min-w-0">
              <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
                تکل
              </p>

              <p className="hidden text-[11px] text-slate-400 sm:block">
                سلامت روان و عملکرد
              </p>
            </div>
          </div>

          <a
            href="/"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-600
              shadow-sm
              transition-colors
              hover:border-sky-200
              hover:bg-sky-50
              hover:text-sky-700
              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >
            <span className="ml-1.5" aria-hidden="true">
              ←
            </span>

            <span className="hidden sm:inline">
              بازگشت به صفحه اصلی
            </span>

            <span className="sm:hidden">
              بازگشت
            </span>
          </a>
        </div>

        {/* Main Content */}
        <div
          className="
            flex
            flex-col
            p-4
            sm:p-6
            md:p-8
            lg:flex-row
            lg:p-10
            xl:p-12
          "
        >
          {/* Image Side */}
          <div
            className="
              safe-fade-up
              flex
              min-w-0
              items-center
              justify-center
              lg:order-1
              lg:w-[52%]
              lg:pl-6
              xl:pl-8
            "
          >
            <div className="relative w-full max-w-[620px]">
              <div
                aria-hidden="true"
                className="
                  absolute
                  -inset-2
                  rounded-[26px]
                  bg-sky-50
                  sm:-inset-3
                  sm:rounded-[32px]
                  lg:-inset-4
                  lg:rounded-[38px]
                "
              />

              <div
                className="
                  relative
                  h-64
                  w-full
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-sky-100
                  bg-slate-100
                  shadow-lg
                  sm:h-80
                  sm:rounded-[28px]
                  md:h-96
                  lg:h-[480px]
                  lg:rounded-[32px]
                "
              >
                <img
                  src="/pic/hero.png"
                  alt="سلامت روان و ورزش"
                  width={1200}
                  height={960}
                  loading="eager"
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                  style={{
                    objectPosition: "center 20%",
                  }}
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-slate-900
                    opacity-[0.06]
                  "
                />

                <div
                  className="
                    absolute
                    right-3
                    top-3
                    rounded-full
                    border
                    border-white
                    bg-white
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-slate-600
                    shadow-sm
                    sm:right-4
                    sm:top-4
                    sm:px-3.5
                    sm:py-2
                    sm:text-xs
                  "
                >
                  سلامت روان و ورزش
                </div>
              </div>

              {/* Quote Balloon */}
              <div
                className="
                  relative
                  mx-auto
                  -mt-8
                  h-24
                  w-[calc(100%-28px)]
                  rounded-2xl
                  border
                  border-sky-100
                  bg-white
                  shadow-lg
                  sm:-mt-10
                  sm:h-28
                  sm:w-[calc(100%-56px)]
                  lg:absolute
                  lg:bottom-[-20px]
                  lg:right-[-28px]
                  lg:mx-0
                  lg:h-24
                  lg:w-[280px]
                  xl:right-[-32px]
                  xl:w-[310px]
                "
                aria-live="polite"
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  {quotes.map((quote) => (
                    <div
                      key={quote}
                      className="balloon-quote"
                    >
                      <p
                        className="
                          text-xs
                          font-medium
                          leading-6
                          text-slate-700
                          sm:text-sm
                          sm:leading-7
                          lg:text-[13px]
                          lg:leading-6
                        "
                      >
                        {quote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div
            dir="rtl"
            className="
              safe-fade-up-delay
              flex
              min-w-0
              flex-col
              justify-center
              pt-14
              lg:order-2
              lg:w-[48%]
              lg:pl-4
              lg:pt-0
              xl:pl-6
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                justify-center
                lg:justify-start
              "
            >
              <span className="h-px w-8 bg-sky-300" />

              <span className="mx-2 text-xs font-bold text-sky-600 sm:text-sm">
                سلامت روان در ورزش و زندگی
              </span>

              <span className="h-px w-8 bg-sky-300 lg:hidden" />
            </div>

            <h1
              className="
                max-w-[700px]
                text-center
                text-3xl
                font-bold
                leading-[1.35]
                tracking-tight
                text-slate-900
                sm:text-4xl
                md:text-[42px]
                lg:text-right
                lg:text-[46px]
                xl:text-[52px]
                2xl:text-[56px]
              "
            >
              ذهن قوی‌تر،
              <br />
              <span className="text-sky-600">
                عملکرد بهتر
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-[620px]
                text-center
                text-sm
                leading-7
                text-slate-500
                sm:mt-5
                sm:text-base
                sm:leading-8
                lg:mx-0
                lg:text-right
              "
            >
              سلامت روان بخش مهمی از عملکرد، تصمیم‌گیری و کیفیت زندگی است.
              با شناخت بهتر ذهن و تمرین مهارت‌های شناختی، مسیر عملکرد بهتر
              را تجربه کنید.
            </p>

            {/* Benefits */}
            <div className="mt-6 sm:mt-7">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="
                    mb-3
                    flex
                    items-start
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                    px-4
                    py-3
                    text-right
                    last:mb-0
                    sm:px-5
                    sm:py-3.5
                  "
                >
                  <span
                    className="
                      mt-1
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-sky-100
                      text-[10px]
                      font-bold
                      text-sky-600
                    "
                  >
                    {index + 1}
                  </span>

                  <p
                    className="
                      mr-3
                      min-w-0
                      text-xs
                      font-medium
                      leading-6
                      text-slate-600
                      sm:text-sm
                      sm:leading-7
                    "
                  >
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div
              className="
                mt-7
                sm:mt-8
                sm:flex
              "
            >
              <a
                href="/mental-health-form"
                className="
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  bg-sky-600
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  transition-colors
                  hover:bg-sky-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sky-400
                  focus:ring-offset-2
                  sm:min-h-[54px]
                  sm:w-1/2
                  sm:text-base
                  sm:ml-2
                "
              >
                ورود کاربر / ثبت نام
              </a>

              <a
                href="/games"
                className="
                  mt-3
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-slate-700
                  shadow-sm
                  transition-colors
                  hover:border-sky-200
                  hover:bg-sky-50
                  hover:text-sky-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sky-400
                  focus:ring-offset-2
                  sm:mt-0
                  sm:min-h-[54px]
                  sm:w-1/2
                  sm:text-base
                  sm:mr-2
                "
              >
                شروع
                <span
                  className="mr-2"
                  aria-hidden="true"
                >
                  ←
                </span>
              </a>
            </div>

            {/* Footer note */}
            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                text-center
                text-[10px]
                text-slate-400
                sm:text-xs
                lg:justify-start
                lg:text-right
              "
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

              <span className="mr-2">
                مسیری برای شناخت بهتر ذهن و تقویت عملکرد
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}