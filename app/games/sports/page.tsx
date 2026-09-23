// Put your photo in public/ and set its path here
const HERO_IMAGE = "/pic/psy.jpeg";

export default function SportsPage() {
  const pillars = [
    { number: "۰۱", title: "شناخت احساسات", text: "احساساتی مثل اضطراب، خشم و ناامیدی را بشناسید؛ هدف حذف آن‌ها نیست، بلکه مدیریت آگاهانه آن‌هاست." },
    { number: "۰۲", title: "مدیریت استرس", text: "تنفس عمیق، تمرکز روی لحظه حال و داشتن یک روتین ذهنی، واکنش شما به فشار مسابقه را کنترل‌پذیرتر می‌کند." },
    { number: "۰۳", title: "اعتمادبه‌نفس", text: "به جای تعریف خود با یک نتیجه، موفقیت‌های کوچک و پیشرفت شخصی‌تان را ببینید و گفت‌وگوی درونی مثبت داشته باشید." },
    { number: "۰۴", title: "تمرکز و کنترل ذهن", text: "بعد از هر اشتباه، ذهن را به وظیفه بعدی برگردانید؛ تمرکز یعنی توانایی بازگشت به لحظه‌ای که اهمیت دارد." },
    { number: "۰۵", title: "تاب‌آوری روانی", text: "شکست، افت عملکرد و آسیب پایان مسیر نیستند. شرایط را بپذیرید، روی بخش‌های قابل کنترل تمرکز کنید و ادامه دهید." },
    { number: "۰۶", title: "خواب و تعادل", text: "استراحت، روابط سالم، تفریح و زندگی خارج از ورزش، بخش جدایی‌ناپذیر بازیابی ذهن و پیشگیری از فرسودگی هستند." },
  ];

  const habits = [
    "احساسات و فشارهای روزانه‌تان را بدون قضاوت ثبت کنید.",
    "پیش از تمرین یا مسابقه، چند دقیقه تنفس عمیق و تمرکز انجام دهید.",
    "اهداف واقع‌بینانه و قابل اندازه‌گیری برای رشد شخصی تعیین کنید.",
    "خواب کافی، استراحت و زمان دور از فضای رقابتی را جدی بگیرید.",
    "در زمان نیاز، با مربی، فرد قابل اعتماد یا روانشناس ورزشی صحبت کنید.",
  ];

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#fffaf4] text-slate-800 selection:bg-orange-200"
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important } }
      `}</style>

      {/* Hero: photo only, nothing on top */}
      <section
        role="img"
        aria-label="ارکان ورزش"
        className="min-h-[100svh] bg-slate-900 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      {/* Intro (appears after scrolling past the hero) */}
      <section className="relative isolate px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="absolute -right-32 -top-20 -z-10 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -left-32 top-48 -z-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

        <nav className="mx-auto flex max-w-6xl items-center justify-between py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-600 text-xl text-white shadow-lg shadow-orange-600/20">
              ✦
            </span>
            ارکان ورزش
          </div>
          <span className="rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-500 backdrop-blur">
            سلامت روان ورزشکاران
          </span>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
              <span className="h-2 w-2 animate-ping rounded-full bg-orange-500" />
              ذهن آماده، بدن آماده
            </div>

            <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.25] tracking-tight text-slate-900 sm:text-6xl">
              سلامت روان؛ پایه‌ای برای{" "}
              <span className="text-orange-600">عملکرد بهتر</span> و زندگی
              متعادل‌تر
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">
              برای رسیدن به بهترین عملکرد، فقط بدن شما به تمرین نیاز ندارد.
              ذهن نیز باید یاد بگیرد با فشار، شکست، اضطراب و لحظه‌های دشوار
              سازنده‌تر روبه‌رو شود.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <a
                href="#article"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-1 hover:bg-orange-600"
              >
                مطالعه مقاله
              </a>
              <a
                href="#pillars"
                className="rounded-2xl border border-orange-200 bg-white px-6 py-3 text-orange-700 transition hover:-translate-y-1 hover:border-orange-400"
              >
                شش پایه سلامت روان
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-[float_5s_ease-in-out_infinite]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-orange-300/40 to-amber-100/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-orange-500 to-amber-400 p-8 shadow-2xl shadow-orange-500/20">
              <div className="absolute -left-8 -top-12 text-9xl opacity-20">☼</div>
              <div className="relative flex min-h-[340px] flex-col justify-between">
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-sm font-semibold">تمرین امروز</span>
                  <span>۰۱ / ۰۶</span>
                </div>
                <div>
                  <div className="mb-5 text-7xl">🧠</div>
                  <h2 className="text-3xl font-black leading-tight text-white">
                    آرام‌تر فکر کن،
                    <br />
                    قوی‌تر ادامه بده.
                  </h2>
                  <p className="mt-4 leading-7 text-orange-50">
                    هر بار که ذهنت را به لحظه حال برمی‌گردانی، یک مهارت مهم
                    ورزشی را تقویت می‌کنی.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-white">
                  <span className="h-2 flex-1 rounded-full bg-white/30">
                    <span className="block h-full w-2/3 rounded-full bg-white" />
                  </span>
                  ۶۶٪ مسیر
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section id="article" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/80 bg-white p-8 shadow-xl shadow-orange-100/60 sm:p-12">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold text-orange-600">آگاهی، اولین قدم است</span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              سلامت روان دقیقاً چیست؟
            </h2>
          </div>

          <div className="space-y-5 text-justify text-base leading-9 text-slate-600 sm:text-lg">
            <p>
              سلامت روان فقط به معنای نداشتن بیماری یا اختلال روانی نیست؛
              بلکه توانایی شناخت احساسات، مدیریت فشارهای روانی، برقراری ارتباط
              سالم، تصمیم‌گیری مناسب و حفظ تعادل در زندگی است.
            </p>
            <p>
              یک ورزشکار برای رسیدن به عملکرد مطلوب، علاوه بر آمادگی جسمانی،
              تمرین منظم و تغذیه مناسب باید بتواند ذهن خود را نیز مدیریت کند.
              استرس مسابقه، ترس از شکست، فشار نتیجه، آسیب‌های ورزشی و مقایسه
              با دیگران، همگی بر وضعیت روانی و عملکرد ورزشی اثر می‌گذارند.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border-r-4 border-orange-500 bg-orange-50 p-6 text-base font-semibold leading-8 text-orange-900 sm:p-8">
            سلامت روان یعنی بتوانیم احساسات و فشارهای خود را بشناسیم، آن‌ها را
            مدیریت کنیم و پس از تجربه شرایط دشوار، دوباره به تعادل بازگردیم.
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-orange-600">نقشه راه ذهنی</span>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                شش پایه برای ذهنی سالم‌تر
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              تقویت هرکدام از این مهارت‌ها، به تعادل بیشتر در زندگی و عملکرد
              بهتر کمک می‌کند.
            </p>
          </div>

          {/* Mobile: 3 rows x 2 columns. Desktop: 2 rows x 3 columns. Photos: public/pillars/1.jpg ... 6.jpg */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.number}
                className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl bg-slate-800 bg-cover bg-center p-4 shadow-lg shadow-orange-100/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[380px] sm:p-7 lg:min-h-[440px]"
                style={{ backgroundImage: `url(/pic/${index + 1}.jpeg)` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/10 transition group-hover:from-slate-950/95"
                />

                <div className="relative flex items-center justify-between">
                  <span className="text-3xl font-black text-white/90 sm:text-5xl">
                    {pillar.number}
                  </span>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-orange-200 backdrop-blur sm:px-3 sm:text-xs">
                    مهارت ذهنی
                  </span>
                </div>

                <div className="relative">
                  <h3 className="text-base font-black text-white sm:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-6 text-slate-200 sm:mt-3 sm:text-sm sm:leading-8">
                    {pillar.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Real Life */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <span className="text-sm font-bold text-orange-600">در زندگی واقعی</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              یک نتیجه، تمام هویت تو نیست.
            </h2>
            <p className="mt-5 leading-8 text-slate-700">
              ممکن است ورزشکاری پس از یک مسابقه ضعیف احساس کند «ورزشکار
              ضعیفی» است؛ اما باید بین «من عملکرد ضعیفی داشتم» و «من ضعیف
              هستم» تفاوت قائل شد. یک مسابقه ارزش و توانایی فرد را تعریف
              نمی‌کند.
            </p>
          </div>

          <div className="rounded-[2rem] bg-slate-900/95 p-7 text-white shadow-2xl shadow-slate-900/15 backdrop-blur sm:p-10">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl">✓</span>
              <div>
                <h3 className="font-black">چک‌لیست مراقبت از ذهن</h3>
                <p className="mt-1 text-xs text-slate-400">هر روز یک قدم کوچک</p>
              </div>
            </div>
            <ul className="space-y-5">
              {habits.map((habit) => (
                <li key={habit} className="flex gap-3 text-sm leading-7 text-slate-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                  {habit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-l from-orange-600 to-amber-500 p-8 text-white shadow-xl shadow-orange-500/20 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-sm font-bold text-orange-100">جمع‌بندی</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">ذهن قوی‌تر، عملکرد بهتر</h2>
            <p className="mt-5 leading-8 text-orange-50">
              سلامت روان یعنی بتوانیم خودمان را بهتر بشناسیم، با فشارها
              سازگار شویم، از شکست‌ها یاد بگیریم و در مسیر رشد، تعادل خود را
              حفظ کنیم. اگر فشار روانی، اضطراب یا فرسودگی بیشتر از توان شماست،
              کمک گرفتن از روانشناس یا روانشناس ورزشی بخشی مهم از مراقبت
              حرفه‌ای است.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-100 px-5 py-8 text-center text-sm text-slate-500">
        ارکان ورزش • همراه مسیر رشد جسم و ذهن
      </footer>
    </main>
  );
}