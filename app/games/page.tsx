import Link from "next/link";
import { gameCategories } from "./data/games";

const categoryIcons: Record<string, string> = {
  thinking: "🧠",
  "mental-health": "❤️",
  "personal-development": "🌱",
  management: "📚",
  sports: "🏃",
  football: "⚽",
};

const categoryStyles: Record<string, string> = {
  thinking: "from-purple-50 to-indigo-50 border-purple-200",
  "mental-health": "from-rose-50 to-pink-50 border-rose-200",
  "personal-development": "from-green-50 to-emerald-50 border-green-200",
  management: "from-amber-50 to-yellow-50 border-amber-200",
  sports: "from-orange-50 to-amber-50 border-orange-200",
  football: "from-emerald-50 to-green-50 border-emerald-200",
};

export default function GamesPage() {
  const visibleCategories = gameCategories.filter(
    (category) => category.id !== "table"
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100"
    ><section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-8 text-center shadow-xl sm:px-10 sm:py-12 md:px-14 md:py-14">
      
      <div className="mx-auto flex w-full max-w-[520px] items-center justify-center">
        <img
          src="/pic/logo.png"
          alt="Tackle"
          className="h-auto w-full max-w-[420px] object-contain drop-shadow-[0_10px_20px_rgba(15,23,42,0.18)] sm:max-w-[480px] md:max-w-[520px]"
        />
      </div>
  
      <h1 className="mt-6 text-2xl font-bold text-slate-800 sm:mt-8 sm:text-4xl md:text-5xl">
        مرکز تمرین‌های شناختی
      </h1>
  
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
        به مرکز بازی‌ها و تمرین‌های تکل خوش آمدید
      </p>
  
    </div>
  </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 text-center sm:mb-10">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl md:text-4xl">
            لابی تکل
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:mt-3 sm:text-base">
            بخش مورد نظر خود را انتخاب کنید
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/games/${category.id}`}
              className="group min-w-0"
            >
              <div
                className={`
                  flex h-full min-h-[220px] flex-col
                  rounded-2xl
                  bg-gradient-to-br
                  ${categoryStyles[category.id] ?? "from-white to-slate-50 border-slate-200"}
                  border
                  p-3
                  shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  sm:min-h-[280px]
                  sm:rounded-3xl
                  sm:p-5
                  md:p-6
                `}
              >
                <div className="flex flex-1 flex-col items-center text-center">
                  <div
                    className="
                      flex h-14 w-14 shrink-0 items-center justify-center
                      rounded-xl
                      bg-white/80
                      text-3xl
                      shadow-sm
                      backdrop-blur
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      sm:h-[72px] sm:w-[72px] sm:rounded-2xl sm:text-4xl
                    "
                  >
                    {categoryIcons[category.id]}
                  </div>

                  <h3 className="mt-4 line-clamp-1 text-base font-bold text-slate-800 sm:mt-5 sm:text-xl md:text-2xl">
                    {category.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">
                    {category.description}
                  </p>

                  <div className="mt-auto pt-4">
                    {category.games.length > 0 ? (
                      <div className="rounded-lg bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm">
                        {category.games.length} بازی
                      </div>
                    ) : (
                      <div className="rounded-lg bg-white/70 px-3 py-1.5 text-[11px] text-slate-500 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm">
                        ورود به بخش
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}