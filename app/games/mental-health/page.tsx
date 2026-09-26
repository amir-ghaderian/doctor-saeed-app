const HERO_IMAGE = "/pic/mental.jpeg";

export default function SportsPage() {
  const pillars = [
    {
      number: "۱",
      title: "شناخت احساسات",
      text: "احساساتی مثل اضطراب، خشم و ناامیدی را بشناسید؛ هدف حذف آن‌ها نیست، بلکه مدیریت آگاهانه آن‌هاست.",
    },
    {
      number: "۲",
      title: "مدیریت استرس",
      text: "تنفس عمیق، تمرکز روی لحظه حال و داشتن یک روتین ذهنی، واکنش شما به فشار مسابقه را کنترل‌پذیرتر می‌کند.",
    },
    {
      number: "۳",
      title: "اعتمادبه‌نفس",
      text: "به جای تعریف خود با یک نتیجه، موفقیت‌های کوچک و پیشرفت شخصی‌تان را ببینید و گفت‌وگوی درونی مثبت داشته باشید.",
    },
    {
      number: "۴",
      title: "تمرکز و کنترل ذهن",
      text: "بعد از هر اشتباه، ذهن را به وظیفه بعدی برگردانید؛ تمرکز یعنی توانایی بازگشت به لحظه‌ای که اهمیت دارد.",
    },
    {
      number: "۵",
      title: "تاب‌آوری روانی",
      text: "شکست، افت عملکرد و آسیب پایان مسیر نیستند. شرایط را بپذیرید، روی بخش‌های قابل کنترل تمرکز کنید و ادامه دهید.",
    },
    {
      number: "۶",
      title: "خواب و تعادل",
      text: "استراحت، روابط سالم، تفریح و زندگی خارج از ورزش، بخش جدایی‌ناپذیر بازیابی ذهن و پیشگیری از فرسودگی هستند.",
    },
  ];

  const mentalHealthBenefits = [
    {
      icon: "🧠",
      title: "تمرکز و تصمیم‌گیری",
      text: "افزایش تمرکز، دقت و قدرت تصمیم‌گیری",
    },
    {
      icon: "⚡",
      title: "مدیریت فشار",
      text: "مدیریت بهتر استرس، اضطراب و فشارهای روزمره",
    },
    {
      icon: "💪",
      title: "تاب‌آوری",
      text: "افزایش تاب‌آوری در برابر شکست و مشکلات",
    },
    {
      icon: "🎯",
      title: "عملکرد بهتر",
      text: "بهبود عملکرد تحصیلی، شغلی و ورزشی",
    },
    {
      icon: "❤️",
      title: "روابط سالم",
      text: "تقویت روابط اجتماعی و کنترل هیجانات",
    },
    {
      icon: "🌱",
      title: "اعتمادبه‌نفس",
      text: "افزایش اعتمادبه‌نفس و احساس رضایت از زندگی",
    },
  ];

  const mentalHealthPillars = [
    {
      number: "۱",
      icon: "🌱",
      title: "خودآگاهی",
      text: "شناخت احساسات، افکار، نقاط قوت و نقاط قابل بهبود.",
    },
    {
      number: "۲",
      icon: "❤️",
      title: "مدیریت هیجانات",
      text: "توانایی کنترل و تنظیم خشم، اضطراب، ترس و هیجان‌های شدید.",
    },
    {
      number: "۳",
      icon: "🧘",
      title: "مدیریت استرس",
      text: "استفاده از تنفس، آرام‌سازی، ورزش و برنامه‌ریزی برای کنترل فشار روانی.",
    },
    {
      number: "۴",
      icon: "😴",
      title: "خواب و استراحت کافی",
      text: "خواب مناسب برای تمرکز، خلق‌وخو و عملکرد شناختی اهمیت زیادی دارد.",
    },
    {
      number: "۵",
      icon: "🏃",
      title: "فعالیت بدنی",
      text: "ورزش منظم می‌تواند به بهبود خلق، کاهش استرس و افزایش انرژی کمک کند.",
    },
    {
      number: "۶",
      icon: "🤝",
      title: "روابط سالم",
      text: "داشتن ارتباطات حمایتگر، گفت‌وگو و احساس تعلق اجتماعی.",
    },
    {
      number: "۷",
      icon: "🎯",
      title: "تفکر و نگرش واقع‌بینانه",
      text: "شناسایی افکار منفی و جایگزین کردن آنها با نگاه منطقی و قابل‌اجرا.",
    },
    {
      number: "۸",
      icon: "🚀",
      title: "هدف و معنا در زندگی",
      text: "داشتن اهداف مشخص و احساس پیشرفت و معنا.",
    },
    {
      number: "۹",
      icon: "🧑‍⚕️",
      title: "کمک گرفتن در زمان مناسب",
      text: "مراجعه به روان‌شناس یا پزشک در صورت تداوم یا شدت مشکلات روانی، بخشی از مراقبت از سلامت روان است.",
    },
  ];

  const mentalHealthMethods = [
    {
      number: "۰۱",
      title: "خودآگاهی",
      text: "احساسات، افکار و عوامل ایجادکننده فشار روانی را بشناسیم.",
    },
    {
      number: "۰۲",
      title: "تنظیم هیجان",
      text: "قبل از واکنش، مکث کنیم و با تنفس و تمرکز، هیجان را مدیریت کنیم.",
    },
    {
      number: "۰۳",
      title: "فعالیت بدنی",
      text: "ورزش منظم می‌تواند به سلامت روان و کاهش استرس کمک کند.",
    },
    {
      number: "۰۴",
      title: "خواب و تغذیه مناسب",
      text: "خواب کافی و تغذیه متعادل نقش مهمی در عملکرد مغز دارند.",
    },
    {
      number: "۰۵",
      title: "تمرین ذهنی",
      text: "بازی‌های فکری، تمرین تمرکز، یادگیری و حل مسئله، ذهن را فعال نگه می‌دارند.",
    },
    {
      number: "۰۶",
      title: "ارتباط با دیگران",
      text: "صحبت کردن با افراد قابل اعتماد می‌تواند فشار روانی را کاهش دهد.",
    },
    {
      number: "۰۷",
      title: "کمک تخصصی",
      text: "اگر مشکلات روانی شدید، طولانی یا مختل‌کننده زندگی شدند، مراجعه به روان‌شناس یا پزشک اهمیت دارد.",
    },
  ];

  const mentalExercises = [
    {
      number: "۰۱",
      icon: "🌬️",
      title: "تمرین تنفس آرام‌ساز",
      text: "۴ ثانیه دم → ۲ ثانیه مکث → ۶ ثانیه بازدم. ۵ بار تکرار.",
    },
    {
      number: "۰۲",
      icon: "🧠",
      title: "تمرین توقف افکار",
      text: "وقتی یک فکر منفی تکرار می‌شود، آن را بنویس و از خودت بپرس: «آیا این فکر یک واقعیت است یا فقط یک برداشت؟»",
    },
    {
      number: "۰۳",
      icon: "✍️",
      title: "تمرین سه نکته مثبت",
      text: "هر شب ۳ اتفاق، موفقیت یا نکته‌ای که امروز برایت ارزشمند بوده بنویس.",
    },
    {
      number: "۰۴",
      icon: "🎯",
      title: "تمرین تمرکز ۵ دقیقه‌ای",
      text: "یک شیء را انتخاب کن و ۵ دقیقه فقط به جزئیات آن توجه کن؛ هر بار حواست پرت شد، آرام برگردان.",
    },
    {
      number: "۰۵",
      icon: "❤️",
      title: "تمرین قدردانی",
      text: "روزانه سه نفر، اتفاق یا چیزی را که بابت آن قدردان هستی یادداشت کن.",
    },
    {
      number: "۰۶",
      icon: "📝",
      title: "تمرین تخلیه ذهنی",
      text: "قبل از خواب، نگرانی‌ها و کارهای فردا را روی کاغذ بنویس تا ذهنت کمتر درگیر آنها بماند.",
    },
    {
      number: "۰۷",
      icon: "🏃",
      title: "تمرین فعالیت بدنی",
      text: "روزانه پیاده‌روی یا فعالیت بدنی متناسب با شرایطت داشته باش.",
    },
    {
      number: "۰۸",
      icon: "🤝",
      title: "تمرین ارتباط اجتماعی",
      text: "در طول هفته زمانی را برای گفت‌وگو و ارتباط با یک فرد قابل اعتماد اختصاص بده.",
    },
  ];

  const dailyRoutine = [
    {
      time: "صبح",
      icon: "🌅",
      text: "۵ دقیقه تنفس + تعیین یک هدف روزانه",
    },
    {
      time: "ظهر",
      icon: "☀️",
      text: "چند دقیقه فعالیت بدنی + یک تمرین تمرکز",
    },
    {
      time: "شب",
      icon: "🌙",
      text: "نوشتن ۳ نکته مثبت + تخلیه ذهنی",
    },
  ];

  const habits = [
    "احساسات و فشارهای روزانه‌تان را بدون قضاوت ثبت کنید.",
    "پیش از تمرین یا مسابقه، چند دقیقه تنفس عمیق و تمرکز انجام دهید.",
    "اهداف واقع‌بینانه و قابل اندازه‌گیری برای رشد شخصی تعیین کنید.",
    "خواب کافی، استراحت و زمان دور از فضای رقابتی را جدی بگیرید.",
    "در زمان نیاز، با مربی، فرد قابل اعتماد یا روانشناس ورزشی صحبت کنید.",
  ];

  const phases = [
    {
      title: "قبل از مسابقه",
      text: "یک روتین ثابت داشته باشید: چند نفس عمیق، تصویرسازی ذهنی از اجرای خوب و تمرکز روی کارهایی که در کنترل خودتان است.",
    },
    {
      title: "حین مسابقه",
      text: "بعد از هر اشتباه یک نفس بکشید و به وظیفه بعدی برگردید. گفت‌وگوی درونی را کوتاه، ساده و حمایتگر نگه دارید.",
    },
    {
      title: "بعد از مسابقه",
      text: "عملکرد را بدون قضاوت مرور کنید: یک نکته‌ی مثبت، یک نکته‌ی قابل بهبود، و بعد به بدن و ذهن‌تان استراحت بدهید.",
    },
  ];

  const warningSigns = [
    "اضطراب یا نگرانی که بیشتر روزها ادامه دارد.",
    "بی‌خوابی یا خستگی طولانی‌مدت، حتی با استراحت کافی.",
    "از دست دادن علاقه به تمرین و چیزهایی که قبلاً لذت‌بخش بود.",
    "زود عصبانی شدن یا کنار کشیدن از هم‌تیمی‌ها و اطرافیان.",
    "احساس مداوم بی‌ارزشی بعد از هر نتیجه‌ی ضعیف.",
  ];

  const slogans = [
    "ذهن آماده، بدن آماده",
    "آرام‌تر فکر کن، قوی‌تر ادامه بده",
    "یک نتیجه، تمام هویت تو نیست",
    "شکست، پایان مسیر نیست",
    "هر بار که به لحظه حال برمی‌گردی، قوی‌تر می‌شوی",
  ];

  const pillarColors = [
    "from-[#a7c497] via-amber-500 to-yellow-400",
    "from-blue-600 via-cyan-500 to-sky-400",
    "from-violet-600 via-purple-500 to-fuchsia-500",
    "from-emerald-600 via-teal-500 to-cyan-400",
    "from-rose-600 via-pink-500 to-[#b3cd9d]",
    "from-indigo-600 via-blue-500 to-cyan-400",
  ];

  const mentalPillarColors = [
    "from-[#a7c497] to-amber-400",
    "from-rose-500 to-pink-400",
    "from-blue-600 to-cyan-400",
    "from-indigo-600 to-violet-500",
    "from-emerald-600 to-teal-400",
    "from-cyan-600 to-sky-400",
    "from-purple-600 to-fuchsia-500",
    "from-amber-600 to-[#b3cd9d]",
    "from-slate-700 to-slate-500",
  ];

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#fffaf4] text-slate-800 selection:bg-[#d3e3c4]"
    >
      <style>{`
        .slogan {
          opacity: 0;
          animation: sloganCycle 20s ease-in-out infinite;
        }

        .slogan:first-child {
          opacity: 1;
        }

        @keyframes sloganCycle {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }

          3% {
            opacity: 1;
            transform: translateY(0);
          }

          17% {
            opacity: 1;
            transform: translateY(0);
          }

          20% {
            opacity: 0;
            transform: translateY(-18px);
          }

          100% {
            opacity: 0;
            transform: translateY(-18px);
          }
        }

        .dot {
          width: 0.375rem;
          background: rgba(15, 23, 42, 0.22);
          animation: dotCycle 20s ease-in-out infinite;
        }

        .dot:first-child {
          width: 1.5rem;
          background: #a7c497;
        }

        @keyframes dotCycle {
          0% {
            width: 0.375rem;
            background: rgba(15, 23, 42, 0.22);
          }

          1% {
            width: 1.5rem;
            background: #a7c497;
          }

          17% {
            width: 1.5rem;
            background: #a7c497;
          }

          20% {
            width: 0.375rem;
            background: rgba(15, 23, 42, 0.22);
          }

          100% {
            width: 0.375rem;
            background: rgba(15, 23, 42, 0.22);
          }
        }

        @keyframes mentalCardIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mental-card {
          animation: mentalCardIn 0.7s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .slogan,
          .dot,
          .mental-card {
            animation: none !important;
          }

          .slogan:first-child {
            opacity: 1;
          }
        }
      `}</style>

      {/* =========================
          Hero
      ========================== */}
      <section className="bg-white">
        <div className="px-3 pt-3 sm:p-0">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-none">
            <img
              src={HERO_IMAGE}
              alt="مدیریت سلامت روان ورزشکار"
              className="block h-auto w-full sm:h-[100svh] sm:object-cover sm:object-center"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-white/15 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-[12%] flex justify-center px-5 text-center sm:bottom-[18%]">
              <h1 className="sr-only">
                مدیریت سلامت روان ورزشکار
              </h1>

              <div className="grid w-full max-w-3xl place-items-center">
                {slogans.map((text, i) => (
                  <div
                    key={text}
                    className="slogan col-start-1 row-start-1 text-balance text-lg font-black leading-[1.65] text-white drop-shadow-[0_1px_8px_rgba(255,255,255,0.85)] sm:text-4xl sm:leading-[1.5] lg:text-5xl"
                    style={{
                      animationDelay: `${i * 4}s`,
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5 sm:bottom-10 sm:gap-2"
            >
              {slogans.map((text, i) => (
                <span
                  key={text}
                  className="dot h-1 rounded-full sm:h-1.5"
                  style={{
                    animationDelay: `${i * 4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 px-4 pb-3 pt-3 text-sm font-semibold sm:pb-6 sm:pt-4">
          <a
            href="#article"
            className="rounded-full bg-[#a7c497] px-7 py-3 text-white shadow-lg shadow-[#a7c497]/30 transition hover:bg-[#b3cd9d]"
          >
            مطالعه مقاله
          </a>

          <a
            href="#pillars"
            className="rounded-full border border-slate-200 bg-slate-50 px-7 py-3 text-slate-900 backdrop-blur transition hover:bg-slate-100"
          >
            شش پایه سلامت روان
          </a>
        </div>
      </section>

      {/* =========================
          Navigation
      ========================== */}
      <section className="px-5 pt-2 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#728f60]">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#8fae7d] text-xl text-white shadow-lg shadow-[#8fae7d]/20">
              ✦
            </span>

            مدیریت سلامت روان
          </div>

          <span className="rounded-full border border-[#d3e3c4] bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500 backdrop-blur">
            سلامت روان ورزشکاران
          </span>
        </nav>
      </section>

      {/* =========================
          Article
      ========================== */}
      <section
        id="article"
        className="px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/80 bg-white p-8 shadow-xl shadow-[#e8f0e1]/60 sm:p-12">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold text-[#8fae7d]">
              آگاهی، اولین قدم است
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              سلامت روان دقیقاً چیست؟
            </h2>
          </div>

          <div className="space-y-5 text-justify text-base leading-9 text-slate-600 sm:text-lg">
            <p>
              سلامت روان فقط به معنای نداشتن بیماری یا اختلال روانی نیست؛ بلکه
              توانایی شناخت احساسات، مدیریت فشارهای روانی، برقراری ارتباط سالم،
              تصمیم‌گیری مناسب و حفظ تعادل در زندگی است.
            </p>

            <p>
              یک ورزشکار برای رسیدن به عملکرد مطلوب، علاوه بر آمادگی جسمانی،
              تمرین منظم و تغذیه مناسب باید بتواند ذهن خود را نیز مدیریت کند.
              استرس مسابقه، ترس از شکست، فشار نتیجه، آسیب‌های ورزشی و مقایسه با
              دیگران، همگی بر وضعیت روانی و عملکرد ورزشی اثر می‌گذارند.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border-r-4 border-[#a7c497] bg-[#f4f8f1] p-6 text-base font-semibold leading-8 text-[#3f5230] sm:p-8">
            سلامت روان یعنی بتوانیم احساسات و فشارهای خود را بشناسیم، آن‌ها را
            مدیریت کنیم و پس از تجربه شرایط دشوار، دوباره به تعادل بازگردیم.
          </div>
        </div>
      </section>

      {/* =========================
          Mental Health Introduction
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <span className="text-sm font-bold text-[#8fae7d]">
                مدیریت سلامت روان
              </span>

              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                ذهن هم مثل بدن نیاز به تمرین و مراقبت دارد.
              </h2>
            </div>

            <div className="rounded-[2rem] border border-[#e8f0e1] bg-white p-7 shadow-xl shadow-[#e8f0e1]/50 sm:p-9">
              <p className="text-justify text-base leading-9 text-slate-600 sm:text-lg">
                سلامت روان یکی از پایه‌های اصلی کیفیت زندگی، عملکرد فردی و
                موفقیت در ورزش و کار است. همان‌طور که برای سلامت جسم تمرین و
                مراقبت لازم است، ذهن نیز به مدیریت، تمرین و مراقبت مستمر نیاز
                دارد.
              </p>

              <div className="mt-6 rounded-2xl bg-[#f4f8f1] p-5 text-sm font-semibold leading-8 text-[#3f5230]">
                سلامت روان فقط «نداشتن بیماری» نیست؛ بلکه مجموعه‌ای از مهارت‌ها
                و عادت‌هاست که به فرد کمک می‌کند با فشارهای زندگی، روابط و
                چالش‌ها بهتر کنار بیاید.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Benefits
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-[#8fae7d]">
              چرا مهم است؟
            </span>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              اهمیت سلامت روان
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {mentalHealthBenefits.map((item, index) => (
              <article
                key={item.title}
                className="group rounded-3xl border border-white bg-white p-5 text-center shadow-lg shadow-[#e8f0e1]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    index % 2 === 0
                      ? "bg-[#e8f0e1]"
                      : "bg-blue-100"
                  }`}
                >
                  {item.icon}
                </div>

                <h3 className="mt-4 text-sm font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          General Mental Health Pillars
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <span className="text-sm font-bold text-[#8fae7d]">
              🧠 پایه‌های اصلی سلامت روان
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              مهارت‌هایی برای ساختن ذهنی سالم‌تر
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              سلامت روان فقط «نداشتن بیماری» نیست؛ بلکه مجموعه‌ای از مهارت‌ها و
              عادت‌هاست که به فرد کمک می‌کند با فشارهای زندگی، روابط و چالش‌ها
              بهتر کنار بیاید.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentalHealthPillars.map((item, index) => (
              <article
                key={item.number}
                className={`mental-card group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${mentalPillarColors[index]} p-6 text-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
                    </span>

                    <span className="text-sm font-black text-white/70">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/85">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-900 p-7 text-center text-white shadow-2xl sm:p-9">
            <span className="text-sm font-bold text-[#b3cd9d]">
              فرمول ساده
            </span>

            <p className="mt-4 text-base font-black leading-9 sm:text-xl">
              🧠 خودآگاهی + ❤️ تنظیم هیجان + 🏃 فعالیت بدنی + 😴 خواب + 🤝
              ارتباط سالم + 🎯 هدفمندی = سلامت روان بهتر
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Mental Health Methods
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-[#8fae7d]">
              مسیر مراقبت
            </span>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              مدیریت سلامت روان چگونه انجام می‌شود؟
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mentalHealthMethods.map((item) => (
              <article
                key={item.number}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-[#e8f0e1]/40 transition-all duration-500 hover:-translate-y-1 hover:border-[#d3e3c4] hover:shadow-xl"
              >
                <span className="text-4xl font-black text-[#e8f0e1] transition-colors duration-300 group-hover:text-[#d3e3c4]">
                  {item.number}
                </span>

                <h3 className="mt-4 text-base font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          Athlete Mental Skills
      ========================== */}
      <section
        id="pillars"
        className="px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-[#8fae7d]">
                نقشه راه ذهنی ورزشکار
              </span>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                شش پایه برای ذهنی سالم‌تر
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-600">
              تقویت هرکدام از این مهارت‌ها، به تعادل بیشتر در زندگی و عملکرد بهتر
              کمک می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.number}
                className={`group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${pillarColors[index % pillarColors.length]} p-4 shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl sm:min-h-[240px] sm:rounded-3xl sm:p-5 lg:min-h-[270px] lg:p-6`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-white/30"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-black/10 blur-3xl transition-all duration-700 group-hover:scale-125"
                />

                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-2xl font-black tracking-tight text-white/90 transition-transform duration-500 group-hover:scale-110 sm:text-4xl">
                    {pillar.number}
                  </span>

                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/30 sm:px-3 sm:text-[10px]">
                    مهارت ذهنی
                  </span>
                </div>

                <div className="relative z-10 mt-8">
                  <h3 className="text-sm font-black text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-lg lg:text-xl">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-[10px] font-medium leading-5 text-white/85 sm:mt-2.5 sm:text-xs sm:leading-6 lg:text-sm lg:leading-7">
                    {pillar.text}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-white/70 transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          Real Life
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <span className="text-sm font-bold text-[#8fae7d]">
              در زندگی واقعی
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              یک نتیجه، تمام هویت تو نیست.
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              ممکن است ورزشکاری پس از یک مسابقه ضعیف احساس کند «ورزشکار ضعیفی»
              است؛ اما باید بین «من عملکرد ضعیفی داشتم» و «من ضعیف هستم» تفاوت
              قائل شد. یک مسابقه ارزش و توانایی فرد را تعریف نمی‌کند.
            </p>
          </div>

          <div className="rounded-[2rem] bg-slate-900/95 p-7 text-white shadow-2xl shadow-slate-900/15 backdrop-blur sm:p-10">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a7c497] text-2xl">
                ✓
              </span>

              <div>
                <h3 className="font-black">
                  چک‌لیست مراقبت از ذهن
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  هر روز یک قدم کوچک
                </p>
              </div>
            </div>

            <ul className="space-y-5">
              {habits.map((habit) => (
                <li
                  key={habit}
                  className="flex gap-3 text-sm leading-7 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#b3cd9d]" />
                  {habit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================
          Competition Mental Health
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              مدیریت ذهن در روز مسابقه
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              مدیریت سلامت روان فقط برای لحظه‌های بحران نیست؛ بخشی از برنامه‌ی هر
              روز و هر مسابقه است.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <ol className="space-y-4">
              {phases.map((phase, index) => (
                <li
                  key={phase.title}
                  className="flex gap-4 rounded-3xl border border-white/80 bg-white p-5 shadow-lg shadow-[#e8f0e1]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0e1] font-black text-[#728f60]">
                    {index + 1}
                  </span>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {phase.title}
                    </h3>

                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      {phase.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-3xl bg-[#f4f8f1] p-6 sm:p-8">
              <h3 className="text-lg font-black text-[#3f5230]">
                چه زمانی کمک بگیریم؟
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#3f5230]/80">
                اگر چند مورد از این نشانه‌ها را برای مدتی طولانی تجربه می‌کنید،
                با مربی، فرد قابل اعتماد یا روانشناس ورزشی صحبت کنید.
              </p>

              <ul className="mt-5 space-y-3">
                {warningSigns.map((sign) => (
                  <li
                    key={sign}
                    className="flex gap-3 text-sm leading-7 text-slate-700"
                  >
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#a7c497]" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Mental Exercises
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <span className="text-sm font-bold text-[#8fae7d]">
              🧠 تمرین‌های کاربردی سلامت روان
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              ذهن هم با تمرین قوی‌تر می‌شود.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              سلامت روان هم مثل آمادگی جسمانی، با تمرین منظم تقویت می‌شود. چند
              تمرین ساده و کاربردی را می‌توان در برنامه روزانه قرار داد.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mentalExercises.map((exercise, index) => (
              <article
                key={exercise.number}
                className="group relative rounded-[1.75rem] bg-white p-6 shadow-lg shadow-[#e8f0e1]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-500 group-hover:scale-110 ${
                    index % 4 === 0
                      ? "bg-[#e8f0e1]"
                      : index % 4 === 1
                        ? "bg-blue-100"
                        : index % 4 === 2
                          ? "bg-emerald-100"
                          : "bg-violet-100"
                  }`}
                >
                  {exercise.icon}
                </div>

                <span className="absolute left-5 top-5 text-xs font-black text-slate-200">
                  {exercise.number}
                </span>

                <h3 className="mt-5 text-base font-black text-slate-900">
                  {exercise.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {exercise.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          Daily Routine
      ========================== */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900 p-7 text-white shadow-2xl sm:p-10">
            <div className="mb-8">
              <span className="text-sm font-bold text-[#b3cd9d]">
                برنامه ساده روزانه
              </span>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                سه قدم کوچک برای مراقبت از ذهن
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {dailyRoutine.map((item, index) => (
                <article
                  key={item.time}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
                    </span>

                    <span className="text-xs font-bold text-[#bdd6a8]">
                      ۰{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black">
                    {item.time}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-8 text-slate-400">
              نکته مهم: هدف این تمرین‌ها حذف کامل افکار یا احساسات ناخوشایند
              نیست؛ هدف، یادگیری مهارت مدیریت آنهاست.
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Summary
      ========================== */}
      <section className="px-5 pb-20 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#8fae7d] to-[#b3cd9d] p-8 text-white shadow-xl shadow-[#a7c497]/20 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-sm font-bold text-[#e8f0e1]">
              جمع‌بندی
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              ذهن قوی‌تر، عملکرد بهتر
            </h2>

            <p className="mt-5 leading-8 text-[#f4f8f1]">
              سلامت روان یعنی بتوانیم خودمان را بهتر بشناسیم، با فشارها سازگار
              شویم، از شکست‌ها یاد بگیریم و در مسیر رشد، تعادل خود را حفظ کنیم.
              سلامت روان یعنی یاد بگیریم ذهن خود را بشناسیم، هیجانات خود را
              مدیریت کنیم و در شرایط دشوار، تصمیم‌های آگاهانه‌تری بگیریم.
            </p>

            <div className="mt-7 rounded-3xl border border-white/20 bg-white/10 p-5 text-sm leading-8 text-white/90 backdrop-blur">
              اگر فشار روانی، اضطراب یا فرسودگی شدید، طولانی یا مختل‌کننده زندگی
              است، کمک گرفتن از روان‌شناس، روان‌شناس ورزشی یا پزشک می‌تواند بخشی
              از مراقبت حرفه‌ای از سلامت روان باشد.
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Footer
      ========================== */}
      <footer className="border-t border-[#e8f0e1] px-5 py-8 text-center text-sm text-slate-500">
        مدیریت سلامت روان ورزشکار • همراه مسیر رشد جسم و ذهن
      </footer>
    </main>
  );
}