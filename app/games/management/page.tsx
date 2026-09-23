
"use client";

import { motion } from "framer-motion";

const marketingSections = [
  {
    number: "01",
    title: "تحقیقات بازار",
    icon: "search",
    description:
      "شناخت بازار، رقبا، نیازها و رفتار مخاطبان؛ نقطه شروع یک تصمیم‌گیری درست در بازاریابی.",
    image: "/pic/00001.jpeg",
  },
  {
    number: "02",
    title: "استراتژی بازاریابی",
    icon: "target",
    description:
      "تعیین هدف، مخاطب هدف، جایگاه برند و مسیر رسیدن به اهداف بازاریابی.",
    image: "/pic/00002.jpeg",
  },
  {
    number: "03",
    title: "برندسازی",
    icon: "brand",
    description:
      "ایجاد هویت، اعتبار و تصویر مشخص برای برند در ذهن مخاطبان.",
    image: "/pic/00003.jpeg",
  },
  {
    number: "04",
    title: "تولید محتوا",
    icon: "content",
    description:
      "تولید محتوای متنی، تصویری، ویدئویی و آموزشی برای جذب و حفظ مخاطب.",
    image: "/pic/00004.jpeg",
  },
  {
    number: "05",
    title: "تبلیغات",
    icon: "megaphone",
    description:
      "معرفی محصول یا خدمات از طریق رسانه‌های مختلف، مانند شبکه‌های اجتماعی، تبلیغات محیطی و دیجیتال.",
    image: "/pic/00005.jpeg",
  },
  {
    number: "06",
    title: "فروش و تبدیل مخاطب به مشتری",
    icon: "chart",
    description:
      "تبدیل علاقه و توجه مخاطب به خرید یا استفاده از خدمات و ایجاد ارزش واقعی برای کسب‌وکار.",
    image: "/pic/00006.jpeg",
  },
  {
    number: "07",
    title: "ارتباط با مشتری و وفادارسازی",
    icon: "users",
    description:
      "حفظ مشتری، دریافت بازخورد و ایجاد رابطه‌ای بلندمدت و ارزشمند با مخاطبان.",
    image: "/pic/00007.jpeg",
  },
];

function Icon({ type }: { type: string }) {
  const common = "h-6 w-6 fill-none stroke-current stroke-[1.8]";

  switch (type) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 5 5" />
          <path d="M8.5 11h5" />
          <path d="M11 8.5v5" />
        </svg>
      );

    case "target":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1.2" />
          <path d="M12 3.5V2" />
          <path d="M20.5 12H22" />
        </svg>
      );

    case "brand":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M12 3 4.5 6.5v5.2c0 4.5 3 7.6 7.5 9.3 4.5-1.7 7.5-4.8 7.5-9.3V6.5L12 3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "content":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );

    case "megaphone":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M4 13h3l9 5V6l-9 5H4v2Z" />
          <path d="M7 13v5" />
          <path d="M19 9.5c1 .8 1.5 1.6 1.5 2.5s-.5 1.7-1.5 2.5" />
        </svg>
      );

    case "chart":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M4 19.5V5" />
          <path d="M4 19.5h16" />
          <path d="m7 15 3-3 3 2 5-6" />
          <path d="M15 8h3v3" />
        </svg>
      );

    case "users":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.5-3.5 2.4-5.2 5.5-5.2s5 1.7 5.5 5.2" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M16 14c2.5.2 4 1.8 4.5 4.5" />
        </svg>
      );

    default:
      return null;
  }
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [
        number,
        number,
        number,
        number
      ],
    },
  },
};

export default function ManagementPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900"
    >
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -left-40 top-[35%] h-[380px] w-[380px] rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-[30%] h-[320px] w-[320px] rounded-full bg-yellow-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 shadow-[0_25px_80px_rgba(15,23,42,0.14)]"
        >
          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:px-16 lg:py-20 xl:px-20 xl:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,.8)]" />
                آموزش مدیریت و بازاریابی
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.25] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                مارکتینگ چیست؟
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:text-xl lg:leading-9">
                مارکتینگ فقط تبلیغ کردن نیست؛ مجموعه‌ای از فعالیت‌ها برای
                شناخت مخاطب، ایجاد ارزش، معرفی محصول یا خدمت و ساختن یک رابطه
                ماندگار با بازار است.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur">
                  شناخت مخاطب
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur">
                  ایجاد ارزش
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur">
                  ارتباط مؤثر
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="absolute inset-5 rounded-[1.5rem] border border-amber-300/10" />

                <div className="relative flex h-full flex-col items-center justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-amber-200/20 bg-amber-300/10 text-6xl shadow-[0_0_60px_rgba(251,191,36,.12)]">
                    📈
                  </div>

                  <span className="mt-7 text-sm font-medium tracking-wider text-amber-200/80">
                    MARKETING
                  </span>

                  <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

                  <p className="mt-4 text-center text-sm leading-7 text-slate-400">
                    شناخت، استراتژی، ارتباط
                    <br />
                    و ایجاد ارزش برای مخاطب
                  </p>
                </div>
              </div>

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/10 bg-white/10 px-5 py-4 shadow-xl backdrop-blur-md sm:block"
              >
                <div className="text-xs text-slate-400">هدف اصلی</div>

                <div className="mt-1 text-sm font-bold text-white">
                  ایجاد ارتباط پایدار با بازار
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Definition */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto mt-12 max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 via-yellow-300 to-transparent" />

            <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-none stroke-current stroke-[1.7]"
                >
                  <path d="M6 4h12" />
                  <path d="M6 8h12" />
                  <path d="M6 12h7" />
                  <path d="M6 16h10" />
                  <path d="M6 20h8" />
                </svg>
              </div>

              <div>
                <span className="text-sm font-bold text-amber-600">
                  تعریف مارکتینگ
                </span>

                <p className="mt-3 text-base leading-8 text-slate-600 sm:text-lg lg:text-xl lg:leading-9">
                  مارکتینگ یا بازاریابی مجموعه‌ای از فعالیت‌ها و فرایندهایی
                  است که برای شناخت نیاز مخاطب، معرفی و ارائه محصول یا خدمت،
                  ایجاد ارزش و برقراری ارتباط مؤثر با مشتری انجام می‌شود؛ با
                  هدف ایجاد و حفظ ارتباط پایدار با بازار.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Simple definition */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto mt-8 max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-500 p-[1px] shadow-[0_20px_60px_rgba(245,158,11,0.16)]">
            <div className="relative rounded-[calc(2rem-1px)] bg-white px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
              <div className="absolute left-8 top-8 text-5xl font-black text-amber-100">
                ”
              </div>

              <div className="relative">
                <div className="text-sm font-bold text-amber-600">
                  به زبان ساده
                </div>

                <p className="mt-4 max-w-4xl text-xl font-bold leading-9 text-slate-800 sm:text-2xl sm:leading-10 lg:text-3xl lg:leading-[1.9]">
                  مارکتینگ یعنی شناخت مخاطب مناسب، ارائه پیشنهاد مناسب، از
                  مسیر مناسب و در زمان مناسب.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section heading */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mt-24 text-center lg:mt-28"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            مسیر بازاریابی
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            بخش‌های اصلی مارکتینگ
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base lg:text-lg lg:leading-8">
            برای درک بهتر بازاریابی، می‌توان آن را به مجموعه‌ای از بخش‌های
            مهم و به‌هم‌پیوسته تقسیم کرد.
          </p>
        </motion.section>

        {/* Marketing cards */}
        <section className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-9">
          {marketingSections.map((item, index) => (
            <motion.article
              key={item.number}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1] as [
                  number,
                  number,
                  number,
                  number
                ],
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(15,23,42,0.13)]"
            >
              {/* Card image */}
              <div className="relative h-56 overflow-hidden sm:h-60 lg:h-64 xl:h-72">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Image overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-slate-950/15" />

                {/* Number */}
                <div className="absolute right-5 top-5 rounded-xl border border-white/20 bg-slate-950/80 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  {item.number}
                </div>

                {/* Icon */}
                <div className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:bg-amber-500">
                  <Icon type={item.icon} />
                </div>

                {/* Title on image */}
                <div className="absolute bottom-5 left-5 right-24">
                  <div className="text-xs font-medium text-white/70">
                    آموزش مارکتینگ
                  </div>

                  <div className="mt-1 text-lg font-black leading-7 text-white sm:text-xl">
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Card content */}
              <div className="p-7 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white">
                    <Icon type={item.icon} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-black leading-8 text-slate-800 sm:text-xl">
                      {item.title}
                    </h3>

                    <div className="mt-2 h-1 w-8 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-14" />
                  </div>
                </div>

                <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base sm:leading-8">
                  {item.description}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs font-medium text-slate-400">
                    آموزش مارکتینگ
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-amber-50 group-hover:text-amber-600">
                    ←
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Future content area */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mt-12 overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 sm:p-10 lg:p-12"
        >
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-right">
            <div>
              <div className="text-sm font-bold text-slate-800">
                فضای توسعه محتوا
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                این بخش می‌تواند در ادامه برای ویدئوهای آموزشی، تصاویر،
                فایل‌های آموزشی، مثال‌های واقعی و تمرین‌های مرتبط با مارکتینگ
                استفاده شود.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              +
            </div>
          </div>
        </motion.section>

        {/* Bottom */}
        <footer className="pb-6 pt-16 text-center">
          <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <p className="mt-6 text-xs text-slate-400">
            آموزش مدیریت و بازاریابی • تکل
          </p>
        </footer>
      </div>
    </main>
  );
}

