export type TableLevel = {
  id: number;
  letters: string[];
  words: string[];
  bonusWords: string[];
};

export const tableLevels: TableLevel[] = [
  {
    id: 1,
    letters: ["د", "م", "ا", "ر"],
    words: ["ما", "دار", "مادر"],
    bonusWords: [
      "در",
      "مار",
      "رام",
      "دام",
      "مد",
      "راد",
      "آر",
      "دا",
      "را",
      "ام",
      "دم",
      "ماد",
      "دارا",
      "آدم",
      "مرد",
      "مادر",
      "داماد",
      "رام",
      "راد",
      "مار",
      "ماد",
      "دما",
      "راما",
      "آرا",
      "دارم",
      "مادرم",
    ],
  },

  {
    id: 2,
    letters: ["ا", "س", "ت", "ر"],
    words: ["سر", "راست", "تار"],
    bonusWords: [
      "را",
      "رس",
      "تا",
      "رسا",
      "سار",
      "رست",
      "تر",
      "رت",
      "است",
      "ستر",
      "سرا",
      "سرت",
      "راست",
      "ترا",
      "تراس",
      "ارس",
      "آر",
      "اس",
      "ات",
      "رسات",
      "ترس",
      "رست",
      "سات",
      "سارا",
    ],
  },

  {
    id: 3,
    letters: ["ی", "ب", "ا", "ز"],
    words: ["باز", "بازی", "زیبا"],
    bonusWords: [
      "با",
      "بی",
      "از",
      "ای",
      "زیب",
      "باز",
      "بیز",
      "زی",
      "زای",
      "آب",
      "آبی",
      "بای",
      "زبی",
      "زبا",
      "یاب",
      "یابی",
      "بازو",
      "زیبایی",
      "بازیا",
      "بازی",
      "آز",
      "آیا",
      "بیاز",
      "زیا",
      "بیا",
    ],
  },

  {
    id: 4,
    letters: ["ا", "ک", "ت", "ب"],
    words: ["کت", "تاب", "کتاب"],
    bonusWords: [
      "با",
      "تا",
      "تب",
      "کات",
      "تاک",
      "کت",
      "تاب",
      "بات",
      "کا",
      "اب",
      "بت",
      "باک",
      "تاک",
      "کاب",
      "کاتا",
      "کتا",
      "تابک",
      "بکتا",
      "آب",
      "آت",
      "کب",
      "کبت",
      "بکا",
      "تبا",
      "کتاب",
    ],
  },

  {
    id: 5,
    letters: ["خ", "و", "ر", "ش"],
    words: ["خور", "روش", "خورش"],
    bonusWords: [
      "رو",
      "ور",
      "خو",
      "رش",
      "خوش",
      "خور",
      "روش",
      "شور",
      "ورش",
      "خورش",
      "خرو",
      "رود",
      "شور",
      "خوشی",
      "روشن",
      "خروش",
      "روشنی",
      "خوار",
      "خوری",
      "شورخ",
      "رخ",
      "شر",
      "خورشید",
      "خود",
      "رو",
    ],
  },
];

export function getTableLevel(
  levelId: number
): TableLevel | undefined {
  return tableLevels.find(
    (level) => level.id === levelId
  );
}

export function checkTableWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  return level.words.includes(word);
}

export function isBonusWord(
  levelId: number,
  word: string
): boolean {
  const level = getTableLevel(levelId);

  if (!level) {
    return false;
  }

  return level.bonusWords.includes(word);
}