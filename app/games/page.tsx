import GameCard from "./components/GameCard";
import { gameCategories } from "./data/games";


export default function GamesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100">

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12">

        <div
          className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          p-10
          md:p-14
          text-center
          "
        >

          <div
            className="
            w-24
            h-24
            mx-auto
            rounded-full
            bg-gradient-to-br
            from-cyan-400
            to-blue-600
            flex
            items-center
            justify-center
            text-5xl
            shadow-lg
            "
          >
            🧠
          </div>


          <h1
            className="
            mt-8
            text-4xl
            md:text-5xl
            font-bold
            text-slate-800
            "
          >
            مرکز تمرین‌های شناختی
          </h1>


          <p
            className="
            mt-5
            text-lg
            text-slate-600
            max-w-2xl
            mx-auto
            leading-8
            "
          >
            بازی‌های شناختی و روان‌شناختی برای تقویت حافظه،
            تمرکز، حل مسئله و مهارت‌های ذهنی
          </p>

        </div>

      </section>



      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {
          gameCategories.map((category) => (

            <div
              key={category.id}
              className="
              mb-10
              bg-white
              rounded-3xl
              shadow-lg
              border
              p-8
              md:p-10
              "
            >

              <div className="mb-8">

                <h2
                  className="
                  text-2xl
                  md:text-3xl
                  font-bold
                  text-slate-800
                  "
                >
                  {category.title}
                </h2>


                <p
                  className="
                  mt-3
                  text-slate-500
                  "
                >
                  {category.description}
                </p>

              </div>



              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
                "
              >

                {
                  category.games.map((game) => (

                    <GameCard
                      key={game.id}
                      id={game.id}
                      title={game.title}
                      description={game.description}
                      icon={game.icon}
                      style={game.style}
                    />

                  ))
                }

              </div>


            </div>

          ))
        }

      </section>


    </main>
  );
}