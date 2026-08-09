import { Game } from "../types/game";

type GameCategory = {
  id: string;
  title: string;
  description: string;
  games: Game[];
};

export const gameCategories: GameCategory[] = [
  {
    id: "table",
    title: "جدول",
    description: "بازی جدول برای تقویت تمرکز، حافظه و حل مسئله",
    games: [
      {
        id: "table",
        title: "بازی جدول",
        description: "یک بازی مرحله‌ای برای تقویت تمرکز و حل مسئله",
        icon: "🧩",
        style: "from-blue-100 to-cyan-100 border-blue-200",
      },
    ],
  },

  {
    id: "thinking",
    title: "بازی‌های فکری",
    description: "مجموعه‌ای از بازی‌ها برای تقویت مهارت‌های شناختی",
    games: [],
  },

  {
    id: "mental-health",
    title: "مدیریت سلامت روان",
    description: "تمرین‌ها و بازی‌هایی برای شناخت و مدیریت بهتر سلامت روان",
    games: [],
  },

  {
    id: "personal-development",
    title: "رشد و توسعه فردی",
    description: "تمرین‌هایی برای رشد فردی، خودشناسی و تقویت مهارت‌های فردی",
    games: [],
  },

  {
    id: "management",
    title: "آموزش مدیریت",
    description: "محتوای آموزشی و تمرین‌های مرتبط با مهارت‌های مدیریت",
    games: [],
  },

  {
    id: "sports",
    title: "ارکان ورزش",
    description: "آموزش و تمرین درباره جنبه‌های مختلف ورزش و عملکرد ورزشی",
    games: [],
  },

  {
    id: "football",
    title: "فوتبال",
    description: "بازی‌ها و تمرین‌های مرتبط با فوتبال و روان‌شناسی ورزشی",
    games: [],
  },
];