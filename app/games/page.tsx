import Link from "next/link";
import GameCard from "./components/GameCard";
import { gameCategories } from "./data/games";

const categoryIcons: Record<string, string> = {
  table: "🧩",
  thinking: "🧠",
  "mental-health": "❤️",
  "personal-development": "🌱",
  management: "📚",
  sports: "🏃",
  football: "⚽",
};

const categoryStyles: Record<string, string> = {
  table: "from-blue-50 to-cyan-50 border-blue-200",
  thinking: "from-purple-50 to-indigo-50 border-purple-200",
  "mental-health": "from-rose-50 to-pink-50 border-rose-200",
  "personal-development": "from-green-50 to-emerald-50 border-green-200",
  management: "from-amber-50 to-yellow-50 border-amber-200",
  sports: "from-orange-50 to-amber-50 border-orange-200",
  football: "from-emerald-50 to-green-50 border-emerald-200",
};

export default function GamesPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100"
    >
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="bg-white rounded-3xl shadow-xl border p-10 md:p-14 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-5xl shadow-lg">
            🧠
          </div>

          <h1 className="mt-8 text-4xl md:text-5xl font-bold text-slate-800">
            مرکز تمرین‌های شناختی
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-8">
            به مرکز بازی‌ها و تمرین‌های دکتر سعید خوش آمدید
          </p>
        </div>
      </section>

      {/* Lobby */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            لابی بازی‌ها
          </h2>

          <p className="mt-3 text-slate-500">
            بخش مورد نظر خود را انتخاب کنید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gameCategories.map((category) => (
            <Link
              key={category.id}
              href={`/games/${category.id}`}
              className="group"
            >
              <div
                className={`
                  h-full
                  min-h-[310px]
                  rounded-3xl
                  bg-gradient-to-br
                  ${categoryStyles[category.id] ?? "from-white to-slate-50 border-slate-200"}
                  border
                  p-6
                  shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                  group-hover:scale-[1.01]
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="
                      w-20
                      h-20
                      rounded-2xl
                      bg-white/80
                      backdrop-blur
                      flex
                      items-center
                      justify-center
                      text-5xl
                      shadow-sm
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    {categoryIcons[category.id]}
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-800">
                    {category.title}
                  </h3>

                  <p className="mt-4 text-sm text-slate-600 leading-7">
                    {category.description}
                  </p>

                  {category.games.length > 0 ? (
                    <div className="mt-6 px-5 py-2 rounded-xl bg-white/80 text-sm font-semibold text-slate-700">
                      {category.games.length} بازی
                    </div>
                  ) : (
                    <div className="mt-6 px-5 py-2 rounded-xl bg-white/70 text-sm text-slate-500">
                      ورود به بخش
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}