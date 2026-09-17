// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// const quotes = [
//   "سلام، من دکتر سعید هستم.",
//   "سلامت روان، مهم‌ترین عامل موفقیت در تمام جنبه‌های زندگی",
//   "ذهن آرام و متمرکز = تصمیم‌های بهتر + عملکرد مطلوب‌تر",
//   "ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند",
//   "سلامت روان به اندازه سلامت جسم اهمیت دارد",
//   "تمرین تمرکز و مهارت‌های شناختی، عملکرد ذهن را بهبود می‌بخشد",
//   "سلامت روان = کیفیت زندگی + موفقیت + آینده‌ای سالم‌تر",
// ];

// const benefits = [
//   "ذهن آرام و متمرکز، تصمیم‌های بهتر و عملکرد مطلوب‌تر می‌سازد",
//   "ورزشکار با روان قوی، فشار مسابقات را بهتر مدیریت می‌کند",
//   "سرمایه‌گذاری روی سلامت روان = کیفیت زندگی بهتر",
// ];

// export default function BalloonVersion() {
//   const [quoteIndex, setQuoteIndex] = useState(0);

//   useEffect(() => {
//     const interval = window.setInterval(() => {
//       setQuoteIndex((prev) => (prev + 1) % quotes.length);
//     }, 4000);

//     return () => window.clearInterval(interval);
//   }, []);

//   return (
//     <main
//       dir="rtl"
//       className="
//         min-h-screen
//         min-h-[100svh]
//         bg-[#f7fbfd]
//         px-4 py-4
//         sm:px-6 sm:py-6
//         lg:px-8 lg:py-8
//         flex items-center justify-center
//       "
//     >
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           fixed inset-0 overflow-hidden
//         "
//       >
//         <div
//           className="
//             absolute
//             -top-32 -right-32
//             h-72 w-72
//             rounded-full
//             bg-sky-100/70
//             blur-3xl
//             sm:h-96 sm:w-96
//           "
//         />

//         <div
//           className="
//             absolute
//             -bottom-40 -left-40
//             h-80 w-80
//             rounded-full
//             bg-cyan-100/60
//             blur-3xl
//             sm:h-[28rem] sm:w-[28rem]
//           "
//         />
//       </div>

//       <section
//         className="
//           relative z-10
//           w-full
//           max-w-[1380px]
//           overflow-hidden
//           rounded-[28px]
//           border border-slate-200/80
//           bg-white
//           shadow-[0_24px_80px_rgba(15,23,42,0.10)]
//           sm:rounded-[32px]
//           lg:rounded-[40px]
//         "
//       >
//         <div
//           className="
//             flex
//             items-center
//             justify-between
//             gap-3
//             border-b border-slate-100
//             px-4 py-3
//             sm:px-6 sm:py-4
//             lg:px-8
//           "
//         >
//           <div className="flex min-w-0 items-center gap-2">
//             <div
//               className="
//                 flex h-9 w-9 shrink-0 items-center justify-center
//                 rounded-xl
//                 bg-sky-50
//                 text-sky-600
//                 sm:h-10 sm:w-10
//               "
//             >
//               <span className="text-lg">✦</span>
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
//                 تَکَل
//               </p>

//               <p className="hidden text-[11px] text-slate-400 sm:block">
//                 سلامت روان و عملکرد
//               </p>
//             </div>
//           </div>

//           <Link
//             href="/"
//             className="
//               inline-flex shrink-0 items-center justify-center
//               rounded-xl
//               border border-slate-200
//               bg-white
//               px-3 py-2
//               text-xs font-semibold
//               text-slate-600
//               shadow-sm
//               transition
//               hover:border-sky-200
//               hover:bg-sky-50
//               hover:text-sky-700
//               sm:px-4 sm:py-2.5 sm:text-sm
//             "
//           >
//             <span className="ml-1.5">←</span>
//             <span className="hidden sm:inline">بازگشت به صفحه اصلی</span>
//             <span className="sm:hidden">بازگشت</span>
//           </Link>
//         </div>

//         <div
//           className="
//             grid
//             grid-cols-1
//             gap-8
//             p-4
//             sm:gap-10 sm:p-6
//             md:p-8
//             lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
//             lg:gap-12
//             lg:p-10
//             xl:gap-16
//             xl:p-12
//           "
//         >
//           <motion.div
//             initial={{ opacity: 0, x: -35 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7, ease: "easeOut" }}
//             className="
//               relative
//               flex
//               min-w-0
//               items-center
//               justify-center
//               lg:order-1
//             "
//           >
//             <div className="relative w-full max-w-[620px]">
//               <div
//                 aria-hidden="true"
//                 className="
//                   absolute
//                   -inset-2
//                   rounded-[28px]
//                   bg-sky-50
//                   sm:-inset-3 sm:rounded-[34px]
//                   lg:-inset-4 lg:rounded-[40px]
//                 "
//               />

//               <div
//                 className="
//                   relative
//                   aspect-[4/3]
//                   w-full
//                   overflow-hidden
//                   rounded-[24px]
//                   border
//                   border-sky-100
//                   bg-slate-100
//                   shadow-[0_20px_50px_rgba(14,116,144,0.16)]
//                   sm:rounded-[30px]
//                   lg:aspect-[5/4]
//                   lg:rounded-[34px]
//                 "
//               >
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-white/10" />

//                 <div
//                   className="absolute inset-0 bg-cover bg-center"
//                   style={{
//                     backgroundImage: "url('/pic/hero.png')",
//                     backgroundPosition: "center 20%",
//                   }}
//                 />

//                 <div
//                   className="
//                     absolute right-3 top-3
//                     rounded-full
//                     border border-white/70
//                     bg-white/85
//                     px-3 py-1.5
//                     text-[10px]
//                     font-semibold
//                     text-slate-600
//                     shadow-sm
//                     backdrop-blur-md
//                     sm:right-4 sm:top-4
//                     sm:px-3.5 sm:py-2
//                     sm:text-xs
//                   "
//                 >
//                   سلامت روان و ورزش
//                 </div>
//               </div>

//               <div
//                 className="
//                   relative
//                   mx-auto
//                   -mt-8
//                   w-[calc(100%-32px)]
//                   sm:-mt-10
//                   sm:w-[calc(100%-64px)]
//                   lg:absolute
//                   lg:-bottom-5
//                   lg:-right-8
//                   lg:mx-0
//                   lg:mt-0
//                   lg:w-[280px]
//                   xl:-right-10
//                   xl:w-[310px]
//                 "
//               >
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={quoteIndex}
//                     initial={{ opacity: 0, y: 12 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.45, ease: "easeOut" }}
//                     className="
//                       rounded-2xl
//                       border border-sky-100
//                       bg-white
//                       px-4 py-3.5
//                       shadow-[0_16px_40px_rgba(15,23,42,0.12)]
//                       sm:px-5 sm:py-4
//                     "
//                   >
//                     <p
//                       className="
//                         text-center
//                         text-xs
//                         font-medium
//                         leading-6
//                         text-slate-700
//                         sm:text-sm
//                         sm:leading-7
//                         lg:text-[13px]
//                         lg:leading-6
//                       "
//                     >
//                       {quotes[quoteIndex]}
//                     </p>
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             dir="rtl"
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//               delay: 0.15,
//               duration: 0.7,
//               ease: "easeOut",
//             }}
//             className="
//               flex
//               min-w-0
//               flex-col
//               justify-center
//               lg:order-2
//             "
//           >
//             <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
//               <span className="h-px w-8 bg-sky-300" />

//               <span className="text-xs font-bold tracking-wide text-sky-600 sm:text-sm">
//                 سلامت روان در ورزش و زندگی
//               </span>

//               <span className="h-px w-8 bg-sky-300 lg:hidden" />
//             </div>

//             <h1
//               className="
//                 max-w-[700px]
//                 text-center
//                 text-3xl
//                 font-bold
//                 leading-[1.35]
//                 tracking-tight
//                 text-slate-900
//                 sm:text-4xl
//                 md:text-[42px]
//                 lg:text-right
//                 lg:text-[46px]
//                 xl:text-[52px]
//                 2xl:text-[56px]
//               "
//             >
//               ذهن قوی‌تر،
//               <br />
//               <span className="text-sky-600">عملکرد بهتر</span>
//             </h1>

//             <p
//               className="
//                 mx-auto
//                 mt-4
//                 max-w-[620px]
//                 text-center
//                 text-sm
//                 leading-7
//                 text-slate-500
//                 sm:mt-5
//                 sm:text-base
//                 sm:leading-8
//                 lg:mx-0
//                 lg:text-right
//               "
//             >
//               سلامت روان بخش مهمی از عملکرد، تصمیم‌گیری و کیفیت زندگی است.
//               با شناخت بهتر ذهن و تمرین مهارت‌های شناختی، مسیر عملکرد بهتر
//               را تجربه کنید.
//             </p>

//             <div className="mt-6 grid gap-2.5 sm:mt-7 sm:gap-3">
//               {benefits.map((benefit, index) => (
//                 <div
//                   key={benefit}
//                   className="
//                     flex
//                     items-start
//                     gap-3
//                     rounded-2xl
//                     border border-slate-100
//                     bg-slate-50/70
//                     px-4 py-3
//                     text-right
//                     sm:px-5 sm:py-3.5
//                   "
//                 >
//                   <span
//                     className="
//                       mt-1
//                       flex
//                       h-5 w-5
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-sky-100
//                       text-[10px]
//                       font-bold
//                       text-sky-600
//                     "
//                   >
//                     {index + 1}
//                   </span>

//                   <p
//                     className="
//                       min-w-0
//                       text-xs
//                       font-medium
//                       leading-6
//                       text-slate-600
//                       sm:text-sm
//                       sm:leading-7
//                     "
//                   >
//                     {benefit}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <div
//               className="
//                 mt-7
//                 grid
//                 grid-cols-1
//                 gap-3
//                 sm:mt-8
//                 sm:grid-cols-2
//                 sm:gap-4
//                 lg:max-w-[600px]
//               "
//             >
//               <Link
//                 href="/mental-health-form"
//                 className="
//                   inline-flex
//                   min-h-12
//                   items-center
//                   justify-center
//                   rounded-2xl
//                   bg-sky-600
//                   px-5
//                   py-3
//                   text-sm
//                   font-bold
//                   text-white
//                   shadow-[0_10px_25px_rgba(2,132,199,0.20)]
//                   transition
//                   hover:bg-sky-700
//                   hover:shadow-[0_14px_30px_rgba(2,132,199,0.25)]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-sky-400
//                   focus:ring-offset-2
//                   sm:min-h-[54px]
//                   sm:text-base
//                 "
//               >
//                 ورود کاربر / ثبت نام
//               </Link>

//               <Link
//                 href="/games"
//                 className="
//                   inline-flex
//                   min-h-12
//                   items-center
//                   justify-center
//                   rounded-2xl
//                   border
//                   border-slate-200
//                   bg-white
//                   px-5
//                   py-3
//                   text-sm
//                   font-bold
//                   text-slate-700
//                   shadow-sm
//                   transition
//                   hover:border-sky-200
//                   hover:bg-sky-50
//                   hover:text-sky-700
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-sky-400
//                   focus:ring-offset-2
//                   sm:min-h-[54px]
//                   sm:text-base
//                 "
//               >
//                 شروع
//                 <span className="mr-2">←</span>
//               </Link>
//             </div>

//             <div
//               className="
//                 mt-5
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 text-center
//                 text-[10px]
//                 text-slate-400
//                 sm:text-xs
//                 lg:justify-start
//                 lg:text-right
//               "
//             >
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

//               <span>
//                 مسیری برای شناخت بهتر ذهن و تقویت عملکرد
//               </span>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </main>
//   );
// }
"use client";

import { motion } from "framer-motion";

export default function ComingSoonPage() {
  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        min-h-[100svh]
        bg-[#f7fbfd]
        px-4 py-5
        sm:px-6 sm:py-6
        lg:px-8 lg:py-8
        flex items-center justify-center
        overflow-hidden
      "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="
            absolute
            -top-40 -right-40
            h-80 w-80
            rounded-full
            bg-sky-100/70
            blur-3xl
            sm:h-[30rem] sm:w-[30rem]
          "
        />

        <div
          className="
            absolute
            -bottom-40 -left-40
            h-80 w-80
            rounded-full
            bg-cyan-100/60
            blur-3xl
            sm:h-[32rem] sm:w-[32rem]
          "
        />
      </div>

      <section
        className="
          relative z-10
          w-full
          max-w-[1180px]
          overflow-hidden
          rounded-[28px]
          border border-slate-200/80
          bg-white
          shadow-[0_24px_80px_rgba(15,23,42,0.10)]
          sm:rounded-[34px]
          lg:rounded-[40px]
        "
      >
        <header
          className="
            flex
            items-center
            justify-between
            border-b border-slate-100
            px-5 py-4
            sm:px-7 sm:py-5
            lg:px-9
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10 w-10
                items-center justify-center
                rounded-xl
                bg-sky-50
                text-sky-600
                sm:h-11 sm:w-11
              "
            >
              <span className="text-xl">✦</span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-700 sm:text-base">
                تَکل
              </div>

              <div className="hidden text-[11px] text-slate-400 sm:block">
                سلامت روان و عملکرد
              </div>
            </div>
          </div>

          <div
            className="
              rounded-full
              border border-sky-100
              bg-sky-50
              px-3 py-1.5
              text-[10px]
              font-bold
              text-sky-600
              sm:px-4 sm:py-2
              sm:text-xs
            "
          >
            به‌زودی
          </div>
        </header>

        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-8
            px-5 py-10
            sm:px-8 sm:py-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-14
            lg:px-12 lg:py-14
            xl:px-16 xl:py-16
          "
        >
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              order-1
              flex
              justify-center
              lg:order-2
            "
          >
            <div
              className="
                relative
                flex
                aspect-square
                w-full
                max-w-[300px]
                items-center
                justify-center
                sm:max-w-[350px]
                lg:max-w-[400px]
              "
            >
              {/* Outer glow */}
              <div
                className="
                  absolute
                  inset-3
                  rounded-full
                  bg-sky-50
                  blur-sm
                "
              />

              {/* Main circle */}
              <div
                className="
                  relative
                  flex
                  h-[82%]
                  w-[82%]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-sky-100
                  bg-gradient-to-br
                  from-sky-50
                  via-white
                  to-cyan-50
                  shadow-[0_25px_70px_rgba(14,116,144,0.14)]
                "
              >
                <div
                  className="
                    absolute
                    inset-5
                    z-10
                    rounded-full
                    border
                    border-dashed
                    border-sky-200
                  "
                />

                {/* Head image */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    relative
                    z-20
                    h-[72%]
                    w-[72%]
                    overflow-hidden
                    rounded-full
                  "
                >
                  <img
                    src="/pic/drHead.png"
                    alt="تَکل"
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />
                </motion.div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  bottom-[8%]
                  left-0
                  z-30
                  rounded-2xl
                  border border-white
                  bg-white/95
                  px-4 py-3
                  text-center
                  shadow-[0_12px_35px_rgba(15,23,42,0.10)]
                  backdrop-blur
                  sm:px-5
                "
              >
                <div className="text-[10px] font-semibold text-slate-400">
                  آماده باشید
                </div>

                <div className="mt-1 text-xs font-bold text-slate-700 sm:text-sm">
                  خبر خوب در راه است
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              order-2
              text-center
              lg:order-1
              lg:text-right
            "
          >
            <div className="mb-5 flex items-center justify-center gap-2 lg:justify-start">
              <span className="h-px w-8 bg-sky-300" />

              <span className="text-xs font-bold text-sky-600 sm:text-sm">
                یک شروع تازه
              </span>

              <span className="h-px w-8 bg-sky-300 lg:hidden" />
            </div>

            <h1
              className="
                text-5xl
                font-black
                leading-tight
                tracking-tight
                text-slate-900
                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
              "
            >
              به‌زودی
            </h1>

            <div
              className="
                mx-auto
                mt-5
                h-1
                w-16
                rounded-full
                bg-sky-500
                lg:mx-0
              "
            />

            <h2
              className="
                mt-6
                text-2xl
                font-bold
                leading-[1.5]
                text-slate-800
                sm:text-3xl
                lg:text-4xl
                xl:text-[42px]
              "
            >
              بزرگ‌ترین رویداد
              <br />
              <span className="text-sky-600">
                روان‌شناسی ورزشی کشور
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-[620px]
                text-sm
                leading-8
                text-slate-500
                sm:text-base
                sm:leading-9
                lg:mx-0
                lg:text-lg
              "
            >
              یک اتفاق بزرگ در راه است.
              <br />
              تیم تَکل در حال آماده‌سازی چیزی است که به‌زودی
              خبرهای خوبش را با شما به اشتراک می‌گذارد.
            </p>

            <div
              className="
                mx-auto
                mt-7
                max-w-[560px]
                rounded-2xl
                border border-sky-100
                bg-sky-50/70
                px-5 py-4
                sm:px-6 sm:py-5
                lg:mx-0
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  leading-7
                  text-slate-700
                  sm:text-base
                "
              >
                خبر خوب در راهه...
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-6
                  text-slate-500
                  sm:text-sm
                "
              >
                چند روز دیگر با یک اتفاق بزرگ دوباره برمی‌گردیم.
              </p>
            </div>

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                text-slate-400
                sm:text-xs
                lg:justify-start
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>تَکل؛ ذهن قوی‌تر، عملکرد بهتر</span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}