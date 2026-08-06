import { Game } from "../types/game";


type GameCategory = {
  id: string;
  title: string;
  description: string;
  games: Game[];
};


export const gameCategories: GameCategory[] = [

  {
    id: "memory",
    title: "تقویت حافظه",
    description:
      "تمرین‌هایی برای تقویت حافظه کوتاه‌مدت و یادآوری",

    games: [

      {
        id: "table",
        title: "بازی جدول",
        description:
          "تقویت حل مسئله و برنامه‌ریزی ذهنی",
        icon: "🧩",
        style:
          "from-blue-100 to-cyan-100 border-blue-200",
      },


      {
        id: "memory",
        title: "حافظه",
        description:
          "تمرین یادآوری و نگهداری اطلاعات",
        icon: "🧠",
        style:
          "from-green-100 to-emerald-100 border-green-200",
      },

    ],
  },


  {
    id: "attention",
    title: "تمرکز و توجه",
    description:
      "تمرین افزایش توجه پایدار و کنترل تمرکز",

    games: [

      {
        id: "attention",
        title: "تمرکز",
        description:
          "افزایش توجه و دقت",
        icon: "🎯",
        style:
          "from-purple-100 to-pink-100 border-purple-200",
      },

    ],
  },

];